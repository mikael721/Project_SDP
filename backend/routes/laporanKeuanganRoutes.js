const express = require("express");
const router = express.Router();
const laporanKeuanganController = require("../controllers/laporanKeuanganController");

router.get("/", laporanKeuanganController.getLaporanKeuangan);
router.get("/penjualan", laporanKeuanganController.getLaporanPenjualanDetail);
router.get("/pembelian", laporanKeuanganController.getLaporanPembelianDetail);

module.exports = router;
