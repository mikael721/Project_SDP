// controllers/pesananDetailController.js
const PesananDetail = require("../models/PesananDetail");

exports.getAllPesananDetails = async (req, res) => {
  try {
    const { include_deleted } = req.query;

    const options = {
      order: [["createdAt", "DESC"]],
    };

    if (include_deleted === "true") {
      options.paranoid = false;
    }

    const pesananDetails = await PesananDetail.findAll(options);

    res.status(200).json({
      success: true,
      message: "Pesanan details retrieved successfully",
      data: pesananDetails,
    });
  } catch (error) {
    console.error("Error getting pesanan details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve pesanan details",
      error: error.message,
    });
  }
};

exports.getPesananDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const { include_deleted } = req.query;

    const options = {
      where: { pesanan_detail_id: id },
    };

    if (include_deleted === "true") {
      options.paranoid = false;
    }

    const pesananDetail = await PesananDetail.findOne(options);

    if (!pesananDetail) {
      return res.status(404).json({
        success: false,
        message: "Pesanan detail not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pesanan detail retrieved successfully",
      data: pesananDetail,
    });
  } catch (error) {
    console.error("Error getting pesanan detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve pesanan detail",
      error: error.message,
    });
  }
};

exports.getPesananDetailsByPesananId = async (req, res) => {
  try {
    const { pesanan_id } = req.params;
    const { include_deleted } = req.query;

    const options = {
      where: { pesanan_id },
      order: [["createdAt", "ASC"]],
    };

    if (include_deleted === "true") {
      options.paranoid = false;
    }

    const pesananDetails = await PesananDetail.findAll(options);

    res.status(200).json({
      success: true,
      message: "Pesanan details retrieved successfully",
      data: pesananDetails,
    });
  } catch (error) {
    console.error("Error getting pesanan details by pesanan_id:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve pesanan details",
      error: error.message,
    });
  }
};

exports.createPesananDetail = async (req, res) => {
  try {
    const { menu_id, pesanan_detail_jumlah, pesanan_id } = req.body;

    const newPesananDetail = await PesananDetail.create({
      menu_id,
      pesanan_detail_jumlah,
      pesanan_id,
    });

    res.status(201).json({
      success: true,
      message: "Pesanan detail created successfully",
      data: newPesananDetail,
    });
  } catch (error) {
    console.error("Error creating pesanan detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create pesanan detail",
      error: error.message,
    });
  }
};

exports.updatePesananDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { pesanan_detail_jumlah } = req.body;

    const pesananDetail = await PesananDetail.findByPk(id);

    if (!pesananDetail) {
      return res.status(404).json({
        success: false,
        message: "Pesanan detail not found",
      });
    }

    await pesananDetail.update({
      pesanan_detail_jumlah,
    });

    res.status(200).json({
      success: true,
      message: "Pesanan detail updated successfully",
      data: pesananDetail,
    });
  } catch (error) {
    console.error("Error updating pesanan detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update pesanan detail",
      error: error.message,
    });
  }
};

exports.deletePesananDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const pesananDetail = await PesananDetail.findByPk(id);

    if (!pesananDetail) {
      return res.status(404).json({
        success: false,
        message: "Pesanan detail not found",
      });
    }

    await pesananDetail.destroy();

    res.status(200).json({
      success: true,
      message: "Pesanan detail deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting pesanan detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete pesanan detail",
      error: error.message,
    });
  }
};

exports.restorePesananDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const pesananDetail = await PesananDetail.findOne({
      where: { pesanan_detail_id: id },
      paranoid: false,
    });

    if (!pesananDetail) {
      return res.status(404).json({
        success: false,
        message: "Pesanan detail not found",
      });
    }

    if (!pesananDetail.deletedAt) {
      return res.status(400).json({
        success: false,
        message: "Pesanan detail is not deleted",
      });
    }

    await pesananDetail.restore();

    res.status(200).json({
      success: true,
      message: "Pesanan detail restored successfully",
      data: pesananDetail,
    });
  } catch (error) {
    console.error("Error restoring pesanan detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to restore pesanan detail",
      error: error.message,
    });
  }
};
