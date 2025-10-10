const BahanBaku = require("../models/bahanBakuModel");
const {
  addBahanBakuSchema,
  updateBahanBakuSchema,
} = require("../validations/bahanBakuValidation");

// GET ALL
exports.getAllBahanBaku = async (req, res) => {
  try {
    const bahanBakuList = await BahanBaku.findAll();
    return res.status(200).json(bahanBakuList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET ONE
exports.getBahanBakuById = async (req, res) => {
  try {
    const bahanBaku = await BahanBaku.findByPk(req.params.id);
    if (!bahanBaku) {
      return res.status(404).json({ message: "Bahan baku tidak ditemukan!" });
    }
    return res.status(200).json(bahanBaku);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ADD
exports.addBahanBaku = async (req, res) => {
  try {
    const { error } = addBahanBakuSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newBahanBaku = await BahanBaku.create(req.body);
    return res
      .status(201)
      .json({ message: "Bahan baku berhasil ditambahkan!", newBahanBaku });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//UPDATE JUMLAH (PERTAMBAHAN)
exports.addBahanBakuJumlah = async (req, res) => {
  try {
    const { error } = updateBahanBakuSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { bahan_baku_id, bahan_baku_jumlah } = req.body;

    const bahanBaku = await BahanBaku.findByPk(bahan_baku_id);
    if (!bahanBaku) {
      return res.status(404).json({ message: "Bahan baku tidak ditemukan!" });
    }

    bahanBaku.bahan_baku_jumlah += bahan_baku_jumlah;
    await bahanBaku.save();

    return res
      .status(200)
      .json({ message: "Jumlah bahan baku berhasil ditambahkan!", bahanBaku });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//UPDATE JUMLAH (PENGURANGAN)
exports.subtractBahanBakuJumlah = async (req, res) => {
  try {
    const { error } = updateBahanBakuSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { bahan_baku_id, bahan_baku_jumlah } = req.body;

    const bahanBaku = await BahanBaku.findByPk(bahan_baku_id);
    if (!bahanBaku) {
      return res.status(404).json({ message: "Bahan baku tidak ditemukan!" });
    }

    if (bahanBaku.bahan_baku_jumlah - bahan_baku_jumlah < 0) {
      return res.status(400).json({
        message: "Pengurangan jumlah bahan baku tidak bisa di bawah 0!",
      });
    }

    bahanBaku.bahan_baku_jumlah -= bahan_baku_jumlah;
    await bahanBaku.save();

    return res
      .status(200)
      .json({ message: "Jumlah bahan baku berhasil dikurangi!", bahanBaku });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// DELETE PAKEK ID
exports.deleteBahanBaku = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBahanBaku = await BahanBaku.destroy({
      where: { bahan_baku_id: id },
    });

    if (deletedBahanBaku === 0) {
      return res.status(404).json({ message: "Bahan baku tidak ditemukan!" });
    }

    return res.status(200).json({ message: "Bahan baku berhasil dihapus." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
