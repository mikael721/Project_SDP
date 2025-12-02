const HeaderPenjualan = require("../models/headerPenjualanModel");
const Penjualan = require("../models/penjualanModel");
const Menu = require("../models/menuModels");
const {
  headerPenjualanSchema,
  detailPenjualanSchema,
} = require("../validations/mainPenjualanValidation");

// Create Header Penjualan
const createHeaderPenjualan = async (req, res) => {
  try {
    const { error, value } = headerPenjualanSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      });
    }

    const headerPenjualan = await HeaderPenjualan.create(value);

    return res.status(201).json({
      message: "Header penjualan berhasil dibuat",
      data: headerPenjualan,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal membuat header penjualan",
      error: err.message,
    });
  }
};

// Create Detail Penjualan
const createDetailPenjualan = async (req, res) => {
  try {
    const { error, value } = detailPenjualanSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      });
    }

    // Verify header penjualan exists
    const headerExists = await HeaderPenjualan.findByPk(
      value.header_penjualan_id
    );
    if (!headerExists) {
      return res.status(404).json({
        message: "Header penjualan tidak ditemukan",
      });
    }

    // Verify menu exists
    const menuExists = await Menu.findByPk(value.menu_id);
    if (!menuExists) {
      return res.status(404).json({
        message: "Menu tidak ditemukan",
      });
    }

    const penjualan = await Penjualan.create(value);

    return res.status(201).json({
      message: "Detail penjualan berhasil dibuat",
      data: penjualan,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal membuat detail penjualan",
      error: err.message,
    });
  }
};

// Get All Penjualan dengan Header
const getAllPenjualan = async (req, res) => {
  try {
    const penjualan = await HeaderPenjualan.findAll({
      include: [
        {
          model: Penjualan,
          as: "penjualans",
          include: [
            {
              model: Menu,
              as: "menu",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Berhasil mengambil data penjualan",
      data: penjualan,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal mengambil data penjualan",
      error: err.message,
    });
  }
};

// Get Penjualan by ID
const getPenjualanById = async (req, res) => {
  try {
    const { id } = req.params;

    const penjualan = await HeaderPenjualan.findByPk(id, {
      include: [
        {
          model: Penjualan,
          as: "penjualans",
          include: [
            {
              model: Menu,
              as: "menu",
            },
          ],
        },
      ],
    });

    if (!penjualan) {
      return res.status(404).json({
        message: "Penjualan tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Berhasil mengambil data penjualan",
      data: penjualan,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal mengambil data penjualan",
      error: err.message,
    });
  }
};

// Update Header Penjualan
const updateHeaderPenjualan = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = headerPenjualanSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      });
    }

    const headerPenjualan = await HeaderPenjualan.findByPk(id);

    if (!headerPenjualan) {
      return res.status(404).json({
        message: "Header penjualan tidak ditemukan",
      });
    }

    await headerPenjualan.update(value);

    return res.status(200).json({
      message: "Header penjualan berhasil diupdate",
      data: headerPenjualan,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal update header penjualan",
      error: err.message,
    });
  }
};

module.exports = {
  createHeaderPenjualan,
  createDetailPenjualan,
  getAllPenjualan,
  getPenjualanById,
  updateHeaderPenjualan,
};
