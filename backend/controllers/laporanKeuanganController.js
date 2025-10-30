const HeaderPenjualan = require("../models/headerPenjualanModel");
const Penjualan = require("../models/penjualanModel");
const Menu = require("../models/menuModels");
const Pembelian = require("../models/pembelianModel");
const { Op } = require("sequelize");
const {
  laporanKeuanganSchema,
  laporanKeuanganSchema_tampaRange,
} = require("../validations/laporanKeuanganValidation");

// GET LAPORAN KEUANGAN BERDASARKAN PERIODE
exports.getLaporanKeuangan = async (req, res) => {
  try {
    const { error } = laporanKeuanganSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { tanggal_awal, tanggal_akhir } = req.query;

    let whereConditionPenjualan = {};
    let whereConditionPembelian = {};

    // Jika kedua tanggal ada, gunakan filter range
    if (tanggal_awal && tanggal_akhir) {
      whereConditionPenjualan = {
        header_penjualan_tanggal: {
          [Op.between]: [tanggal_awal, tanggal_akhir],
        },
      };
      whereConditionPembelian = {
        createdAt: {
          [Op.between]: [tanggal_awal, tanggal_akhir],
        },
      };
    }
    // Jika hanya tanggal_awal yang ada
    else if (tanggal_awal) {
      whereConditionPenjualan = {
        header_penjualan_tanggal: {
          [Op.gte]: tanggal_awal,
        },
      };
      whereConditionPembelian = {
        createdAt: {
          [Op.gte]: tanggal_awal,
        },
      };
    }
    // Jika hanya tanggal_akhir yang ada
    else if (tanggal_akhir) {
      whereConditionPenjualan = {
        header_penjualan_tanggal: {
          [Op.lte]: tanggal_akhir,
        },
      };
      whereConditionPembelian = {
        createdAt: {
          [Op.lte]: tanggal_akhir,
        },
      };
    }
    // Jika kedua tanggal tidak ada, return semua data

    // Ambil data penjualan
    const dataPenjualan = await HeaderPenjualan.findAll({
      where: whereConditionPenjualan,
      include: [
        {
          model: Penjualan,
          as: "detailPenjualan",
          include: [
            {
              model: Menu,
              as: "menu",
              attributes: ["menu_harga"],
            },
          ],
        },
      ],
    });

    // Hitung total pendapatan
    let totalPendapatan = 0;
    let totalBiayaTambahan = 0;
    let totalUangMuka = 0;

    dataPenjualan.forEach((header) => {
      totalBiayaTambahan += header.header_penjualan_biaya_tambahan;
      totalUangMuka += header.header_penjualan_uang_muka;

      header.detailPenjualan.forEach((detail) => {
        const subtotal = detail.menu.menu_harga * detail.penjualan_jumlah;
        totalPendapatan += subtotal;
      });
    });

    totalPendapatan += totalBiayaTambahan;

    // Ambil data pembelian (pengeluaran)
    const dataPembelian = await Pembelian.findAll({
      where: whereConditionPembelian,
    });

    // Hitung total pengeluaran
    let totalPengeluaran = 0;
    let totalBiayaTambahanPembelian = 0;

    dataPembelian.forEach((pembelian) => {
      const subtotal =
        pembelian.pembelian_harga_satuan * pembelian.pembelian_jumlah;
      totalPengeluaran += subtotal;
      totalBiayaTambahanPembelian += pembelian.pembelian_biaya_tambahan;
    });

    totalPengeluaran += totalBiayaTambahanPembelian;

    // Hitung laba/rugi
    const labaRugi = totalPendapatan - totalPengeluaran;

    const laporan = {
      periode: {
        tanggal_awal: tanggal_awal || null,
        tanggal_akhir: tanggal_akhir || null,
      },
      pendapatan: {
        total_penjualan: totalPendapatan - totalBiayaTambahan,
        biaya_tambahan: totalBiayaTambahan,
        uang_muka: totalUangMuka,
        total_pendapatan: totalPendapatan,
      },
      pengeluaran: {
        total_pembelian: totalPengeluaran - totalBiayaTambahanPembelian,
        biaya_tambahan: totalBiayaTambahanPembelian,
        total_pengeluaran: totalPengeluaran,
      },
      laba_rugi: labaRugi,
      jumlah_transaksi: {
        penjualan: dataPenjualan.length,
        pembelian: dataPembelian.length,
      },
    };

    return res.status(200).json(laporan);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET LAPORAN PENJUALAN DETAIL
exports.getLaporanPenjualanDetail = async (req, res) => {
  try {
    const { error } = laporanKeuanganSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { tanggal_awal, tanggal_akhir } = req.query;

    let whereCondition = {};

    // Jika kedua tanggal ada, gunakan filter range
    if (tanggal_awal && tanggal_akhir) {
      whereCondition = {
        header_penjualan_tanggal: {
          [Op.between]: [tanggal_awal, tanggal_akhir],
        },
      };
    }
    // Jika hanya tanggal_awal yang ada
    else if (tanggal_awal) {
      whereCondition = {
        header_penjualan_tanggal: {
          [Op.gte]: tanggal_awal,
        },
      };
    }
    // Jika hanya tanggal_akhir yang ada
    else if (tanggal_akhir) {
      whereCondition = {
        header_penjualan_tanggal: {
          [Op.lte]: tanggal_akhir,
        },
      };
    }
    // Jika kedua tanggal tidak ada, return semua data penjualan

    const dataPenjualan = await HeaderPenjualan.findAll({
      where: whereCondition,
      include: [
        {
          model: Penjualan,
          as: "detailPenjualan",
          include: [
            {
              model: Menu,
              as: "menu",
            },
          ],
        },
      ],
      order: [["header_penjualan_tanggal", "DESC"]],
    });

    // Format data dengan total per transaksi
    const laporanDetail = dataPenjualan.map((header) => {
      let totalTransaksi = 0;

      const details = header.detailPenjualan.map((detail) => {
        const subtotal = detail.menu.menu_harga * detail.penjualan_jumlah;
        totalTransaksi += subtotal;

        return {
          menu_nama: detail.menu.menu_nama,
          menu_harga: detail.menu.menu_harga,
          jumlah: detail.penjualan_jumlah,
          subtotal,
        };
      });

      totalTransaksi += header.header_penjualan_biaya_tambahan;

      return {
        header_penjualan_id: header.header_penjualan_id,
        tanggal: header.header_penjualan_tanggal,
        jenis: header.header_penjualan_jenis,
        keterangan: header.header_penjualan_keterangan,
        biaya_tambahan: header.header_penjualan_biaya_tambahan,
        uang_muka: header.header_penjualan_uang_muka,
        detail: details,
        total_transaksi: totalTransaksi,
      };
    });

    return res.status(200).json({
      periode: {
        tanggal_awal: tanggal_awal || null,
        tanggal_akhir: tanggal_akhir || null,
      },
      data: laporanDetail,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET LAPORAN PEMBELIAN DETAIL
exports.getLaporanPembelianDetail = async (req, res) => {
  try {
    const { tanggal_awal, tanggal_akhir } = req.query;

    // Determine which schema to use based on the presence of both dates
    let validationSchema;
    if (tanggal_awal != null && tanggal_akhir != null) {
      validationSchema = laporanKeuanganSchema;
    } else {
      validationSchema = laporanKeuanganSchema_tampaRange;
    }

    const { error } = validationSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    const { bahan_baku_id } = req.query;

    let whereCondition = {};

    // Filter tanggal
    if (tanggal_awal && tanggal_akhir) {
      whereCondition.createdAt = {
        [Op.between]: [tanggal_awal, tanggal_akhir],
      };
    } else if (tanggal_awal) {
      whereCondition.createdAt = {
        [Op.gte]: tanggal_awal,
      };
    } else if (tanggal_akhir) {
      whereCondition.createdAt = {
        [Op.lte]: tanggal_akhir,
      };
    }

    // Tambahkan filter untuk bahan_baku_id jika ada
    if (bahan_baku_id) {
      whereCondition.bahan_baku_id = bahan_baku_id;
    }

    // Ambil data pembelian berdasarkan kondisi
    const dataPembelian = await Pembelian.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
    });

    // Format data
    const laporanDetail = dataPembelian.map((pembelian) => {
      const subtotal =
        pembelian.pembelian_harga_satuan * pembelian.pembelian_jumlah;

      return {
        bahan_baku_id: pembelian.bahan_baku_id,
        tanggal: pembelian.createdAt,
        jumlah: pembelian.pembelian_jumlah,
        satuan: pembelian.pembelian_satuan,
        harga_satuan: pembelian.pembelian_harga_satuan,
        subtotal,
        pembelian_id: pembelian.pembelian_id,
      };
    });

    return res.status(200).json({
      periode: {
        tanggal_awal: tanggal_awal || null,
        tanggal_akhir: tanggal_akhir || null,
      },
      data: laporanDetail,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
