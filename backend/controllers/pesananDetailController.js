// controllers/pesananDetailController.js
const PesananDetail = require("../models/PesananDetail");
const Pesanan = require("../models/Pesanan");
const {
  createPesananDetailSchema,
  createPesananSchema,
} = require("../validations/pesananDetailValidation");

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
      pesanan_email,
      pesanan_tanggal,
      pesanan_tanggal_pengiriman,
    } = req.body;

    const newPesanan = await Pesanan.create({
      pesanan_nama,
      pesanan_lokasi,
      pesanan_email,
      pesanan_tanggal,
      pesanan_tanggal_pengiriman,
      pesanan_status: "pending", // Default status
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

    await pesanan.update({ pesanan_status });

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
