const express = require("express");
const router = express.Router();
const detailPenjualanController = require("../controllers/detailPenjualanController");

router.get("/", detailPenjualanController.getAllDetailPenjualan);
router.get("/header/:header_id", detailPenjualanController.getDetailByHeaderId);
router.get("/:id", detailPenjualanController.getDetailPenjualanById);
router.post("/new", detailPenjualanController.addDetailPenjualan);
router.put("/:id", detailPenjualanController.updateDetailPenjualan);
router.delete("/:id", detailPenjualanController.deleteDetailPenjualan);

module.exports = router;
