const HeaderPenjualan = require("../models/headerPenjualanModel");
const Penjualan = require("../models/penjualanModel");
const Menu = require("../models/menuModels");
const {
  addMainPenjualanSchema,
  updateMainPenjualanSchema,
} = require("../validations/mainPenjualanValidation");

// GET ALL HEADER PENJUALAN
exports.getAllMainPenjualan = async (req, res) => {
  try {
    const penjualanList = await HeaderPenjualan.findAll({
      include: [
        {
          model: Penjualan,
          as: "detailPenjualan",
          include: [
            {
              model: Menu,
              as: "menu",
              attributes: ["menu_id", "menu_nama", "menu_harga"],
            },
          ],
        },
      ],
      order: [["header_penjualan_tanggal", "DESC"]],
    });
    return res.status(200).json(penjualanList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET ONE HEADER PENJUALAN BY ID
exports.getMainPenjualanById = async (req, res) => {
  try {
    const penjualan = await HeaderPenjualan.findByPk(req.params.id, {
      include: [
        {
          model: Penjualan,
          as: "detailPenjualan",
          include: [
            {
              model: Menu,
              as: "menu",
              attributes: ["menu_id", "menu_nama", "menu_harga"],
            },
          ],
        },
      ],
    });

    if (!penjualan) {
      return res.status(404).json({ message: "Penjualan tidak ditemukan!" });
    }
    return res.status(200).json(penjualan);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ADD HEADER PENJUALAN
exports.addMainPenjualan = async (req, res) => {
  try {
    const { error } = addMainPenjualanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newPenjualan = await HeaderPenjualan.create(req.body);
    return res
      .status(201)
      .json({ message: "Penjualan berhasil ditambahkan!", newPenjualan });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE HEADER PENJUALAN
exports.updateMainPenjualan = async (req, res) => {
  try {
    const { error } = updateMainPenjualanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const penjualan = await HeaderPenjualan.findByPk(id);

    if (!penjualan) {
      return res.status(404).json({ message: "Penjualan tidak ditemukan!" });
    }

    await penjualan.update(req.body);
    return res
      .status(200)
      .json({ message: "Penjualan berhasil diperbarui!", penjualan });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// DELETE HEADER PENJUALAN
exports.deleteMainPenjualan = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah ada detail penjualan
    const detailCount = await Penjualan.count({
      where: { header_penjualan_id: id },
    });

    if (detailCount > 0) {
      return res.status(400).json({
        message: "Tidak dapat menghapus! Masih ada detail penjualan terkait.",
      });
    }

    const deletedPenjualan = await HeaderPenjualan.destroy({
      where: { header_penjualan_id: id },
    });

    if (deletedPenjualan === 0) {
      return res.status(404).json({ message: "Penjualan tidak ditemukan!" });
    }

    return res.status(200).json({ message: "Penjualan berhasil dihapus." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
