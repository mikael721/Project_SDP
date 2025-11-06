const Penjualan = require("../models/penjualanModel");
const Menu = require("../models/menuModels");
const HeaderPenjualan = require("../models/headerPenjualanModel");
const {
  addDetailPenjualanSchema,
  updateDetailPenjualanSchema,
} = require("../validations/detailPenjualanValidation");

// GET ALL DETAIL PENJUALAN
exports.getAllDetailPenjualan = async (req, res) => {
  try {
    const detailList = await Penjualan.findAll({
      include: [
        {
          model: Menu,
          as: "menu",
          attributes: ["menu_id", "menu_nama", "menu_harga"],
        },
        {
          model: HeaderPenjualan,
          as: "headerPenjualan",
          attributes: [
            "header_penjualan_id",
            "header_penjualan_tanggal",
            "header_penjualan_jenis",
          ],
        },
      ],
    });
    return res.status(200).json(detailList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET DETAIL PENJUALAN BY HEADER ID
exports.getDetailByHeaderId = async (req, res) => {
  try {
    const { header_id } = req.params;
    const detailList = await Penjualan.findAll({
      where: { header_penjualan_id: header_id },
      include: [
        {
          model: Menu,
          as: "menu",
          attributes: ["menu_id", "menu_nama", "menu_harga"],
        },
      ],
    });

    if (detailList.length === 0) {
      return res
        .status(404)
        .json({ message: "Detail penjualan tidak ditemukan!" });
    }

    return res.status(200).json(detailList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET ONE DETAIL PENJUALAN
exports.getDetailPenjualanById = async (req, res) => {
  try {
    const detail = await Penjualan.findByPk(req.params.id, {
      include: [
        {
          model: Menu,
          as: "menu",
          attributes: ["menu_id", "menu_nama", "menu_harga"],
        },
        {
          model: HeaderPenjualan,
          as: "headerPenjualan",
          attributes: [
            "header_penjualan_id",
            "header_penjualan_tanggal",
            "header_penjualan_jenis",
          ],
        },
      ],
    });

    if (!detail) {
      return res
        .status(404)
        .json({ message: "Detail penjualan tidak ditemukan!" });
    }
    return res.status(200).json(detail);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ADD DETAIL PENJUALAN
exports.addDetailPenjualan = async (req, res) => {
  try {
    const { error } = addDetailPenjualanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Cek apakah header penjualan ada
    const headerExists = await HeaderPenjualan.findByPk(
      req.body.header_penjualan_id
    );
    if (!headerExists) {
      return res
        .status(404)
        .json({ message: "Header penjualan tidak ditemukan!" });
    }

    // Cek apakah menu ada
    const menuExists = await Menu.findByPk(req.body.menu_id);
    if (!menuExists) {
      return res.status(404).json({ message: "Menu tidak ditemukan!" });
    }

    const newDetail = await Penjualan.create(req.body);
    return res
      .status(201)
      .json({ message: "Detail penjualan berhasil ditambahkan!", newDetail });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE DETAIL PENJUALAN
exports.updateDetailPenjualan = async (req, res) => {
  try {
    const { error } = updateDetailPenjualanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const detail = await Penjualan.findByPk(id);

    if (!detail) {
      return res
        .status(404)
        .json({ message: "Detail penjualan tidak ditemukan!" });
    }

    // Jika ada menu_id, cek apakah menu ada
    if (req.body.menu_id) {
      const menuExists = await Menu.findByPk(req.body.menu_id);
      if (!menuExists) {
        return res.status(404).json({ message: "Menu tidak ditemukan!" });
      }
    }

    await detail.update(req.body);
    return res
      .status(200)
      .json({ message: "Detail penjualan berhasil diperbarui!", detail });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// DELETE DETAIL PENJUALAN
exports.deleteDetailPenjualan = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDetail = await Penjualan.destroy({
      where: { penjualan_id: id },
    });

    if (deletedDetail === 0) {
      return res
        .status(404)
        .json({ message: "Detail penjualan tidak ditemukan!" });
    }

    return res
      .status(200)
      .json({ message: "Detail penjualan berhasil dihapus." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
