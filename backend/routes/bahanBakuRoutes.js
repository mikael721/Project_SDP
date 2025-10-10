const express = require("express");
const router = express.Router();
const bahanBakuController = require("../controllers/bahanBakuController");

router.get("/", bahanBakuController.getAllBahanBaku);
router.get("/:id", bahanBakuController.getBahanBakuById);
router.post("/new", bahanBakuController.addBahanBaku);
router.put("/add", bahanBakuController.addBahanBakuJumlah);
router.put("/subtract", bahanBakuController.subtractBahanBakuJumlah);
router.delete("/:id", bahanBakuController.deleteBahanBaku);

module.exports = router;
