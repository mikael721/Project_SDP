// controllers/pesananDetailController.js
const PesananDetail = require("../models/PesananDetail");
const Pesanan = require("../models/Pesanan"); // ADD THIS LINE
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
      pesanan_tanggal,
      pesanan_tanggal_pengiriman,
    } = req.body;

    const newPesanan = await Pesanan.create({
      pesanan_nama,
      pesanan_lokasi,
      pesanan_tanggal,
      pesanan_tanggal_pengiriman,
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
