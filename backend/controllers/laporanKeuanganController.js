const HeaderPenjualan = require("../models/headerPenjualanModel");
const Penjualan = require("../models/penjualanModel");
const Menu = require("../models/menuModels");
const HeaderPembelian = require("../models/headerPembelianModel");
const Pembelian = require("../models/pembelianModel");
const { Op } = require("sequelize");
const {
  laporanKeuanganSchema,
} = require("../validations/laporanKeuanganValidation");

// GET LAPORAN KEUANGAN BERDASARKAN PERIODE
exports.getLaporanKeuangan = async (req, res) => {
  try {
    const { error } = laporanKeuanganSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { tanggal_awal, tanggal_akhir } = req.query;

    // Ambil data penjualan
    const dataPenjualan = await HeaderPenjualan.findAll({
      where: {
        header_penjualan_tanggal: {
          [Op.between]: [tanggal_awal, tanggal_akhir],
        },
      },
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
    const dataPembelian = await HeaderPembelian.findAll({
      where: {
        header_pembelian_tanggal: {
          [Op.between]: [tanggal_awal, tanggal_akhir],
        },
      },
      include: [
        {
          model: Pembelian,
          as: "detailPembelian",
        },
      ],
    });

    // Hitung total pengeluaran
    let totalPengeluaran = 0;
    let totalBiayaTambahanPembelian = 0;

    dataPembelian.forEach((header) => {
      totalBiayaTambahanPembelian += header.header_pembelian_biaya_tambahan;

      header.detailPembelian.forEach((detail) => {
        const subtotal =
          detail.pembelian_harga_satuan * detail.pembelian_jumlah;
        totalPengeluaran += subtotal;
      });
    });

    totalPengeluaran += totalBiayaTambahanPembelian;

    // Hitung laba/rugi
    const labaRugi = totalPendapatan - totalPengeluaran;

    const laporan = {
      periode: {
        tanggal_awal,
        tanggal_akhir,
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

    const dataPenjualan = await HeaderPenjualan.findAll({
      where: {
        header_penjualan_tanggal: {
          [Op.between]: [tanggal_awal, tanggal_akhir],
        },
      },
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
      periode: { tanggal_awal, tanggal_akhir },
      data: laporanDetail,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET LAPORAN PEMBELIAN DETAIL
exports.getLaporanPembelianDetail = async (req, res) => {
  try {
    const { error } = laporanKeuanganSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { tanggal_awal, tanggal_akhir } = req.query;

    const dataPembelian = await HeaderPembelian.findAll({
      where: {
        header_pembelian_tanggal: {
          [Op.between]: [tanggal_awal, tanggal_akhir],
        },
      },
      include: [
        {
          model: Pembelian,
          as: "detailPembelian",
        },
      ],
      order: [["header_pembelian_tanggal", "DESC"]],
    });

    // Format data dengan total per transaksi
    const laporanDetail = dataPembelian.map((header) => {
      let totalTransaksi = 0;

      const details = header.detailPembelian.map((detail) => {
        const subtotal =
          detail.pembelian_harga_satuan * detail.pembelian_jumlah;
        totalTransaksi += subtotal;

        return {
          bahan_baku_id: detail.bahan_baku_id,
          jumlah: detail.pembelian_jumlah,
          satuan: detail.pembelian_satuan,
          harga_satuan: detail.pembelian_harga_satuan,
          subtotal,
        };
      });

      totalTransaksi += header.header_pembelian_biaya_tambahan;

      return {
        header_pembelian_id: header.header_pembelian_id,
        tanggal: header.header_pembelian_tanggal,
        keterangan: header.header_pembelian_keterangan,
        biaya_tambahan: header.header_pembelian_biaya_tambahan,
        detail: details,
        total_transaksi: totalTransaksi,
      };
    });

    return res.status(200).json({
      periode: { tanggal_awal, tanggal_akhir },
      data: laporanDetail,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
