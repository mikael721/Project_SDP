const { Op } = require("sequelize");
const {
  filterLaporanSchema,
} = require("../validations/laporanKeuanganValidation");
const HeaderPenjualan = require("../models/headerPenjualanModel");
const Penjualan = require("../models/penjualanModel");
const Menu = require("../models/menuModels");
const BahanBaku = require("../models/bahanBakuModel");
const Pembelian = require("../models/pembelianModel");
const Pesanan = require("../models/Pesanan");
const PesananDetail = require("../models/PesananDetail");
const Pegawai = require("../models/pegawai");

// Get Laporan Penjualan
const getLaporanPenjualan = async (req, res) => {
  try {
    const { tanggal_awal, tanggal_akhir, jam_awal, jam_akhir, nama } =
      req.query;

    let whereClause = {};
    let whereHeader = {};

    // Filter by date range
    if (tanggal_awal || tanggal_akhir) {
      whereHeader.header_penjualan_tanggal = {};
      if (tanggal_awal) {
        // Combine date with time
        const startTime = jam_awal ? ` ${jam_awal}:00` : " 00:00:00";
        whereHeader.header_penjualan_tanggal[Op.gte] = new Date(
          tanggal_awal + startTime
        );
      }
      if (tanggal_akhir) {
        // Combine date with time
        const endTime = jam_akhir ? ` ${jam_akhir}:59` : " 23:59:59";
        whereHeader.header_penjualan_tanggal[Op.lte] = new Date(
          tanggal_akhir + endTime
        );
      }
    }

    const penjualan = await Penjualan.findAll({
      where: whereClause,
      include: [
        {
          model: HeaderPenjualan,
          as: "header",
          where: Object.keys(whereHeader).length > 0 ? whereHeader : undefined,
          include: [
            {
              model: Pegawai,
              as: "pegawai",
            },
          ],
        },
        {
          model: Menu,
          as: "menu",
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Get pesanan data grouped by header_penjualan_id
    const pesananDataMap = {};
    const pesananDetails = await PesananDetail.findAll({
      include: [
        {
          model: Pesanan,
          as: "pesanan",
        },
      ],
    });

    pesananDetails.forEach((detail) => {
      if (!pesananDataMap[detail.pesanan_id]) {
        pesananDataMap[detail.pesanan_id] = {
          pesanan_id: detail.pesanan?.pesanan_id,
          pesanan_nama: detail.pesanan?.pesanan_nama,
          pesanan_tanggal: detail.pesanan?.pesanan_tanggal,
        };
      }
    });

    // Group by header_penjualan_id AND pesanan_nama untuk pisah per pemesan
    // Jika nama sama tapi waktu berbeda, akan tetap dipisah karena header berbeda
    const groupedData = {};

    penjualan.forEach((item) => {
      // Dapatkan pesanan_nama untuk item ini
      let pesananNama = null;
      for (const pesananId in pesananDataMap) {
        const pesananData = pesananDataMap[pesananId];
        const pesananDetail = pesananDetails.find(
          (pd) =>
            pd.pesanan_id === parseInt(pesananId) && pd.menu_id === item.menu_id
        );
        if (pesananDetail) {
          pesananNama = pesananData.pesanan_nama;
          break;
        }
      }

      // Key berdasarkan header_penjualan_id DAN pesanan_nama untuk pemisahan
      const key = `${item.header_penjualan_id}_${pesananNama || "unknown"}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          header_penjualan_id: item.header_penjualan_id,
          tanggal: item.header?.header_penjualan_tanggal,
          jenis: item.header?.header_penjualan_jenis,
          biaya_tambahan: item.header?.header_penjualan_biaya_tambahan || 0,
          persentase_dp: item.header?.header_penjualan_uang_muka || 0,
          pegawai_id: item.header?.pegawai_id,
          items: [],
          pesanan_nama: pesananNama,
        };
      }

      groupedData[key].items.push({
        penjualan_id: item.penjualan_id,
        menu_id: item.menu_id,
        menu_nama: item.menu?.menu_nama,
        menu_harga: item.menu?.menu_harga,
        penjualan_jumlah: item.penjualan_jumlah,
        subtotal: (item.menu?.menu_harga || 0) * item.penjualan_jumlah,
      });
    });

    // Transform grouped data
    let transformedData = Object.values(groupedData).map((group) => {
      // Calculate totals berdasarkan user requirements
      const totalSubtotal = group.items.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      const totalBiayaTambahan = group.biaya_tambahan || 0;
      const persentaseDP = group.persentase_dp || 0;

      // Formula yang benar:
      // DP = Total Subtotal × (persentaseDP / 100)
      const totalDP = totalSubtotal * (persentaseDP / 100);

      // Grand Total = Total Subtotal + Total Biaya Tambahan
      const grandTotal = totalSubtotal + totalBiayaTambahan;

      // Sisa Pembayaran = Grand Total - DP
      const sisaPembayaran = grandTotal - totalDP;

      return {
        header_penjualan_id: group.header_penjualan_id,
        pesanan_nama: group.pesanan_nama,
        pegawai_id: group.pegawai_id,
        tanggal: group.tanggal,
        jenis: group.jenis,
        items: group.items.map((item) => {
          return {
            menu_id: item.menu_id,
            menu_nama: item.menu_nama,
            menu_harga: item.menu_harga,
            penjualan_jumlah: item.penjualan_jumlah,
            subtotal: item.subtotal,
          };
        }),
        totalSubtotal,
        totalBiayaTambahan,
        persentaseDP,
        totalDP,
        grandTotal,
        sisaPembayaran,
      };
    });

    // Filter by nama if provided
    if (nama) {
      transformedData = transformedData.filter((item) =>
        item.pesanan_nama?.toLowerCase().includes(nama.toLowerCase())
      );
    }

    return res.status(200).json({
      message: "Berhasil mengambil laporan penjualan",
      data: transformedData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal mengambil laporan penjualan",
      error: err.message,
    });
  }
};

// Get Laporan Pembelian
const getLaporanPembelian = async (req, res) => {
  try {
    const { tanggal_awal, tanggal_akhir, jam_awal, jam_akhir, bahan_baku_id } =
      req.query;

    let whereClause = {};

    // Filter by date range
    if (tanggal_awal || tanggal_akhir) {
      whereClause.createdAt = {};
      if (tanggal_awal) {
        // Combine date with time
        const startTime = jam_awal ? ` ${jam_awal}:00` : " 00:00:00";
        whereClause.createdAt[Op.gte] = new Date(tanggal_awal + startTime);
      }
      if (tanggal_akhir) {
        // Combine date with time
        const endTime = jam_akhir ? ` ${jam_akhir}:59` : " 23:59:59";
        whereClause.createdAt[Op.lte] = new Date(tanggal_akhir + endTime);
      }
    }

    // Filter by bahan_baku_id
    if (bahan_baku_id) {
      whereClause.bahan_baku_id = bahan_baku_id;
    }

    const pembelian = await Pembelian.findAll({
      where: whereClause,
      include: [
        {
          model: BahanBaku,
          as: "bahan_baku",
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Transform data for frontend
    const transformedData = pembelian.map((item) => ({
      pembelian_id: item.pembelian_id,
      tanggal: item.createdAt,
      bahan_baku_id: item.bahan_baku_id,
      bahan_baku_nama: item.bahan_baku?.bahan_baku_nama,
      pembelian_jumlah: item.pembelian_jumlah,
      pembelian_satuan: item.pembelian_satuan,
      pembelian_harga_satuan: item.pembelian_harga_satuan,
      subtotal: item.pembelian_jumlah * item.pembelian_harga_satuan,
    }));

    return res.status(200).json({
      message: "Berhasil mengambil laporan pembelian",
      data: transformedData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal mengambil laporan pembelian",
      error: err.message,
    });
  }
};

// Get Laporan Pesanan
const getLaporanPesanan = async (req, res) => {
  try {
    const { tanggal_awal, tanggal_akhir, jam_awal, jam_akhir, nama, menu_id } =
      req.query;

    let wherePesanan = {};
    let whereDetail = {};

    // Filter by date range
    if (tanggal_awal || tanggal_akhir) {
      wherePesanan.pesanan_tanggal = {};
      if (tanggal_awal) {
        // Combine date with time
        const startTime = jam_awal ? ` ${jam_awal}:00` : " 00:00:00";
        wherePesanan.pesanan_tanggal[Op.gte] = new Date(
          tanggal_awal + startTime
        );
      }
      if (tanggal_akhir) {
        // Combine date with time
        const endTime = jam_akhir ? ` ${jam_akhir}:59` : " 23:59:59";
        wherePesanan.pesanan_tanggal[Op.lte] = new Date(
          tanggal_akhir + endTime
        );
      }
    }

    // Filter by nama
    if (nama) {
      wherePesanan.pesanan_nama = {
        [Op.iLike]: `%${nama}%`,
      };
    }

    // Filter by menu_id
    if (menu_id) {
      whereDetail.menu_id = menu_id;
    }

    const pesanan = await Pesanan.findAll({
      where: Object.keys(wherePesanan).length > 0 ? wherePesanan : undefined,
      include: [
        {
          model: PesananDetail,
          as: "details",
          where: Object.keys(whereDetail).length > 0 ? whereDetail : undefined,
          include: [
            {
              model: Menu,
              as: "menu",
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Transform data for frontend
    const transformedData = [];
    pesanan.forEach((pes) => {
      pes.details.forEach((detail) => {
        transformedData.push({
          pesanan_id: pes.pesanan_id,
          pesanan_nama: pes.pesanan_nama,
          pesanan_email: pes.pesanan_email,
          pesanan_lokasi: pes.pesanan_lokasi,
          pesanan_status: pes.pesanan_status,
          tanggal: pes.pesanan_tanggal,
          tanggal_pengiriman: pes.pesanan_tanggal_pengiriman,
          menu_id: detail.menu_id,
          menu_nama: detail.menu?.menu_nama,
          menu_harga: detail.menu?.menu_harga,
          pesanan_detail_jumlah: detail.pesanan_detail_jumlah,
          subtotal:
            (detail.menu?.menu_harga || 0) * detail.pesanan_detail_jumlah,
        });
      });
    });

    return res.status(200).json({
      message: "Berhasil mengambil laporan pesanan",
      data: transformedData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal mengambil laporan pesanan",
      error: err.message,
    });
  }
};

// Get All Laporan
const getAllLaporan = async (req, res) => {
  try {
    const { tanggal_awal, tanggal_akhir, menu_id, bahan_baku_id } = req.query;

    // Get all three reports
    const [penjualanRes, pembelianRes, pesananRes] = await Promise.all([
      getLaporanPenjualanData(tanggal_awal, tanggal_akhir, menu_id),
      getLaporanPembelianData(tanggal_awal, tanggal_akhir, bahan_baku_id),
      getLaporanPesananData(tanggal_awal, tanggal_akhir, menu_id),
    ]);

    return res.status(200).json({
      message: "Berhasil mengambil semua laporan",
      data: {
        penjualan: penjualanRes,
        pembelian: pembelianRes,
        pesanan: pesananRes,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal mengambil laporan",
      error: err.message,
    });
  }
};

// Helper functions
const getLaporanPenjualanData = async (
  tanggal_awal,
  tanggal_akhir,
  menu_id
) => {
  let whereClause = {};
  let whereHeader = {};

  if (tanggal_awal || tanggal_akhir) {
    whereHeader.header_penjualan_tanggal = {};
    if (tanggal_awal) {
      whereHeader.header_penjualan_tanggal[Op.gte] = new Date(tanggal_awal);
    }
    if (tanggal_akhir) {
      whereHeader.header_penjualan_tanggal[Op.lte] = new Date(tanggal_akhir);
    }
  }

  if (menu_id) {
    whereClause.menu_id = menu_id;
  }

  const penjualan = await Penjualan.findAll({
    where: whereClause,
    include: [
      {
        model: HeaderPenjualan,
        as: "header",
        where: Object.keys(whereHeader).length > 0 ? whereHeader : undefined,
      },
      {
        model: Menu,
        as: "menu",
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  // Get pesanan data grouped by header_penjualan_id
  const pesananDetails = await PesananDetail.findAll({
    include: [
      {
        model: Pesanan,
        as: "pesanan",
      },
    ],
  });

  // Group by header_penjualan_id
  const groupedData = {};

  penjualan.forEach((item) => {
    const key = `${item.header_penjualan_id}`;

    if (!groupedData[key]) {
      groupedData[key] = {
        header_penjualan_id: item.header_penjualan_id,
        tanggal: item.header?.header_penjualan_tanggal,
        jenis: item.header?.header_penjualan_jenis,
        biaya_tambahan: item.header?.header_penjualan_biaya_tambahan || 0,
        persentase_dp: item.header?.header_penjualan_uang_muka || 0,
        items: [],
        pesanan_nama: null,
      };
    }

    // Find pesanan name for this menu
    let pesananNama = null;
    pesananDetails.forEach((detail) => {
      if (detail.menu_id === item.menu_id) {
        pesananNama = detail.pesanan?.pesanan_nama;
      }
    });

    groupedData[key].pesanan_nama =
      pesananNama || groupedData[key].pesanan_nama;

    groupedData[key].items.push({
      penjualan_id: item.penjualan_id,
      menu_id: item.menu_id,
      menu_nama: item.menu?.menu_nama,
      menu_harga: item.menu?.menu_harga,
      penjualan_jumlah: item.penjualan_jumlah,
      subtotal: (item.menu?.menu_harga || 0) * item.penjualan_jumlah,
    });
  });

  // Transform grouped data
  return Object.values(groupedData).map((group) => {
    const totalMenu = group.items.reduce((sum, item) => sum + item.subtotal, 0);
    const biayaTambahan = group.biaya_tambahan || 0;
    const persentaseDP = group.persentase_dp || 0;

    const totalSebelumDP = totalMenu + biayaTambahan;
    const totalUangMuka = totalSebelumDP * (persentaseDP / 100);
    const grandTotal = totalSebelumDP - totalUangMuka;

    return {
      header_penjualan_id: group.header_penjualan_id,
      pesanan_nama: group.pesanan_nama,
      tanggal: group.tanggal,
      jenis: group.jenis,
      items: group.items.map((item) => {
        const itemSubtotal = item.subtotal;
        const itemSubtotalSebelumDP = itemSubtotal + biayaTambahan;
        const itemSubtotalUangMuka =
          itemSubtotalSebelumDP * (persentaseDP / 100);

        return {
          menu_nama: item.menu_nama,
          menu_harga: item.menu_harga,
          penjualan_jumlah: item.penjualan_jumlah,
          subtotal: itemSubtotal,
          subtotalSebelumDP: itemSubtotalSebelumDP,
          subtotalUangMuka: itemSubtotalUangMuka,
        };
      }),
      totalMenu,
      biayaTambahan,
      persentaseDP,
      totalSebelumDP,
      totalUangMuka,
      grandTotal,
    };
  });
};

const getLaporanPembelianData = async (
  tanggal_awal,
  tanggal_akhir,
  bahan_baku_id
) => {
  let whereClause = {};

  if (tanggal_awal || tanggal_akhir) {
    whereClause.createdAt = {};
    if (tanggal_awal) {
      whereClause.createdAt[Op.gte] = new Date(tanggal_awal);
    }
    if (tanggal_akhir) {
      whereClause.createdAt[Op.lte] = new Date(tanggal_akhir);
    }
  }

  if (bahan_baku_id) {
    whereClause.bahan_baku_id = bahan_baku_id;
  }

  const pembelian = await Pembelian.findAll({
    where: whereClause,
    include: [
      {
        model: BahanBaku,
        as: "bahan_baku",
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  return pembelian.map((item) => ({
    pembelian_id: item.pembelian_id,
    tanggal: item.createdAt,
    bahan_baku_id: item.bahan_baku_id,
    bahan_baku_nama: item.bahan_baku?.bahan_baku_nama,
    pembelian_jumlah: item.pembelian_jumlah,
    pembelian_satuan: item.pembelian_satuan,
    pembelian_harga_satuan: item.pembelian_harga_satuan,
    subtotal: item.pembelian_jumlah * item.pembelian_harga_satuan,
  }));
};

const getLaporanPesananData = async (tanggal_awal, tanggal_akhir, menu_id) => {
  let wherePesanan = {};
  let whereDetail = {};

  if (tanggal_awal || tanggal_akhir) {
    wherePesanan.pesanan_tanggal = {};
    if (tanggal_awal) {
      wherePesanan.pesanan_tanggal[Op.gte] = new Date(tanggal_awal);
    }
    if (tanggal_akhir) {
      wherePesanan.pesanan_tanggal[Op.lte] = new Date(tanggal_akhir);
    }
  }

  if (menu_id) {
    whereDetail.menu_id = menu_id;
  }

  const transformedData = [];
  pesanan.forEach((pes) => {
    pes.details.forEach((detail) => {
      transformedData.push({
        pesanan_id: pes.pesanan_id,
        pesanan_nama: pes.pesanan_nama,
        pesanan_status: pes.pesanan_status,
        tanggal: pes.pesanan_tanggal,
        menu_id: detail.menu_id,
        menu_nama: detail.menu?.menu_nama,
        menu_harga: detail.menu?.menu_harga,
        pesanan_detail_jumlah: detail.pesanan_detail_jumlah,
        subtotal: (detail.menu?.menu_harga || 0) * detail.pesanan_detail_jumlah,
      });
    });
  });

  return transformedData;
};

module.exports = {
  getLaporanPenjualan,
  getLaporanPembelian,
  getLaporanPesanan,
  getAllLaporan,
};
