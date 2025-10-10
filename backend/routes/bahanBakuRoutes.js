const express = require("express");
const router = express.Router();
const bahanBakuController = require("../controllers/bahanBakuController");

// Routes for Bahan Baku
router.get("/", bahanBakuController.getAllBahanBaku); // Get all Bahan Baku
router.get("/:id", bahanBakuController.getBahanBakuById); // Get Bahan Baku by ID
router.post("/", bahanBakuController.addBahanBaku); // Add a new Bahan Baku
router.put("/add", bahanBakuController.addBahanBakuJumlah); // Add to Bahan Baku jumlah
router.put("/subtract", bahanBakuController.subtractBahanBakuJumlah); // Subtract from Bahan Baku jumlah
router.delete("/:id", bahanBakuController.deleteBahanBaku); // Delete Bahan Baku by ID

module.exports = router;
