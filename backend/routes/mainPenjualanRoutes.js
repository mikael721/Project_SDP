const express = require("express");
const router = express.Router();
const mainPenjualanController = require("../controllers/mainPenjualanController");

router.get("/", mainPenjualanController.getAllMainPenjualan);
router.get("/:id", mainPenjualanController.getMainPenjualanById);
router.post("/new", mainPenjualanController.addMainPenjualan);
router.put("/:id", mainPenjualanController.updateMainPenjualan);
router.delete("/:id", mainPenjualanController.deleteMainPenjualan);

module.exports = router;
