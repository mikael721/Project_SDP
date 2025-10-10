const express = require("express");
const router = express.Router();
const bahanBakuController = require("../controllers/bahanBakucontroller");

// Routes
router.get("/", bahanBakuController.getAllBahanBaku);
router.get("/:id", bahanBakuController.getBahanBakuById);
router.post("/", bahanBakuController.addBahanBaku);
router.put("/:id", bahanBakuController.updateBahanBaku);
router.delete("/:id", bahanBakuController.deleteBahanBaku);

module.exports = router;
