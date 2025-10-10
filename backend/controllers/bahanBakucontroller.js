const BahanBaku = require("../models/bahanBakuModel");

// **1. GET - Mendapatkan semua bahan baku**
exports.getAllBahanBaku = async (req, res) => {
  try {
    const bahanBakuList = await BahanBaku.findAll();
    return res.status(200).json(bahanBakuList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// **2. GET - Mendapatkan bahan baku berdasarkan ID**
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

// **3. POST - Menambahkan bahan baku baru**
exports.addBahanBaku = async (req, res) => {
  try {
    const {
      bahan_baku_nama,
      bahan_baku_jumlah,
      bahan_baku_harga,
      bahan_baku_satuan,
      bahan_baku_harga_satuan,
    } = req.body;
    if (
      !bahan_baku_nama ||
      !bahan_baku_jumlah ||
      !bahan_baku_harga ||
      !bahan_baku_satuan ||
      !bahan_baku_harga_satuan
    ) {
      return res.status(400).json({ message: "Semua kolom harus diisi!" });
    }

    const newBahanBaku = await BahanBaku.create({
      bahan_baku_nama,
      bahan_baku_jumlah,
      bahan_baku_harga,
      bahan_baku_satuan,
      bahan_baku_harga_satuan,
    });

    return res
      .status(201)
      .json({ message: "Bahan baku berhasil ditambahkan!", newBahanBaku });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// **4. PUT - Mengupdate bahan baku berdasarkan ID**
exports.updateBahanBaku = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      bahan_baku_nama,
      bahan_baku_jumlah,
      bahan_baku_harga,
      bahan_baku_satuan,
      bahan_baku_harga_satuan,
    } = req.body;

    const updatedBahanBaku = await BahanBaku.update(
      {
        bahan_baku_nama,
        bahan_baku_jumlah,
        bahan_baku_harga,
        bahan_baku_satuan,
        bahan_baku_harga_satuan,
      },
      { where: { bahan_baku_id: id } }
    );

    if (updatedBahanBaku[0] === 0) {
      return res.status(404).json({ message: "Bahan baku tidak ditemukan!" });
    }

    return res.status(200).json({ message: "Bahan baku berhasil diperbarui!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// **5. DELETE - Menghapus bahan baku berdasarkan ID**
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
