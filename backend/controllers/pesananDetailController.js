// controllers/pesananDetailController.js
const PesananDetail = require("../models/PesananDetail");
const Pesanan = require("../models/Pesanan");
const Menu = require("../models/menuModels");
const Pegawai = require("../models/pegawai");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  createPesananDetailSchema,
  createPesananSchema,
} = require("../validations/pesananDetailValidation");

// === CREATE PESANAN DETAIL ===
exports.createPesananDetail = async (req, res) => {
  try {
    const { error } = createPesananDetailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { menu_id, pesanan_detail_jumlah, pesanan_id } = req.body;

    const newPesananDetail = await PesananDetail.create({
      menu_id,
      pesanan_detail_jumlah,
      pesanan_id,
    });

    return res.status(201).json({
      success: true,
      message: "Pesanan detail created successfully",
      data: newPesananDetail,
    });
  } catch (error) {
    console.error("Error creating pesanan detail:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create pesanan detail",
      error: error.message,
    });
  }
};

// === CREATE PESANAN ===
exports.createPesanan = async (req, res) => {
  try {
    const { error } = createPesananSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      pesanan_nama,
      pesanan_lokasi,
      pesanan_tanggal,
      pesanan_tanggal_pengiriman,
    } = req.body;

    const newPesanan = await Pesanan.create({
      pesanan_nama,
      pesanan_lokasi,
      pesanan_tanggal,
      pesanan_tanggal_pengiriman,
      status: "belum_jadi", // default status
    });

    return res.status(201).json({
      success: true,
      message: "Pesanan created successfully",
      data: newPesanan,
    });
  } catch (error) {
    console.error("Error creating pesanan:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create pesanan",
      error: error.message,
    });
  }
};

// === SHOW PESANAN DETAIL GROUPED BY PESANAN ID ===
exports.showPesananDetailSpesifik = async (req, res) => {
  try {
    const details = await PesananDetail.findAll({
      include: [
        {
          model: Menu,
          as: "menu",
          attributes: ["menu_id", "menu_nama", "menu_harga"],
        },
        {
          model: Pesanan,
          as: "pesanan",
          attributes: ["pesanan_id", "pesanan_nama", "status"],
        },
      ],
      order: [["pesanan_id", "ASC"]],
    });

    // Kelompokkan hasil berdasarkan pesanan_id
    const grouped = details.reduce((acc, item) => {
      const pid = item.pesanan_id;
      const nama = item.pesanan?.pesanan_nama || "Tidak diketahui";
      const status = item.pesanan?.status || "belum_jadi";

      if (!acc[pid]) {
        acc[pid] = {
          pesanan_id: pid,
          pesanan_nama: nama,
          status: status,
          data: [],
        };
      }

      acc[pid].data.push(item);
      return acc;
    }, {});

    const result = Object.values(grouped);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// === UPDATE STATUS PESANAN ===
exports.updateStatusPesanan = async (req, res) => {
  const { id } = req.params;
  try {
    const findPesanan = await Pesanan.findByPk(id);
    if (!findPesanan) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    // Update status secara siklus
    if (findPesanan.status === "belum_bayar") {
      findPesanan.status = "sudah_bayar";
    } else if (findPesanan.status === "sudah_bayar") {
      findPesanan.status = "selesai";
    } else {
      findPesanan.status = "belum_bayar";
    }

    await findPesanan.save();

    return res.status(200).json({
      message: "Status pesanan berhasil diperbarui",
      result: findPesanan,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui status pesanan",
      error: error.message,
    });
  }
};

// === Cek Password Pegawai dengan Token ===
exports.cekPasswordPemesanan = async (req, res) => {
  const { password, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pegawai_id = decoded.pegawai_id;

    const user = await Pegawai.findOne({ where: { pegawai_id } });
    if (!user) {
      return res.status(404).json({ message: "Pegawai tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.pegawai_password);

    if (!isMatch) {
      return res.status(200).json({
        message: "Password salah",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Password benar, akses diizinkan",
      data: {
        pegawai_id: user.pegawai_id,
        pegawai_nama: user.pegawai_nama,
      },
      status: true,
    });
  } catch (error) {
    console.error("Error verifying token/password:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memverifikasi password atau token tidak valid",
      error: error.message,
    });
  }
};

// === GET PESANAN BY ID BESERTA DETAIL ===
exports.getPesananById = async (req, res) => {
  try {
    const { pesanan_id } = req.params;

    const pesanan = await Pesanan.findByPk(pesanan_id, {
      include: [
        {
          model: PesananDetail,
          as: "pesananDetails",
        },
      ],
    });

    if (!pesanan) {
      return res.status(404).json({
        success: false,
        message: "Pesanan not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: pesanan,
    });
  } catch (error) {
    console.error("Error fetching pesanan:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pesanan",
      error: error.message,
    });
  }
};

// === UPDATE PESANAN STATUS (pending, diproses, terkirim) ===
exports.updatePesananStatus = async (req, res) => {
  try {
    const { pesanan_id } = req.params;
    const { pesanan_status } = req.body;

    const validStatuses = ["pending", "diproses", "terkirim"];
    if (!validStatuses.includes(pesanan_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: pending, diproses, or terkirim",
      });
    }

    const pesanan = await Pesanan.findByPk(pesanan_id);
    if (!pesanan) {
      return res.status(404).json({
        success: false,
        message: "Pesanan not found",
      });
    }

    await pesanan.update({ status: pesanan_status });

    return res.status(200).json({
      success: true,
      message: "Pesanan status updated successfully",
      data: pesanan,
    });
  } catch (error) {
    console.error("Error updating pesanan status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update pesanan status",
      error: error.message,
    });
  }
};
