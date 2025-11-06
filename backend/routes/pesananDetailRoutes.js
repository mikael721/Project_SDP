// routes/pesananDetailRoutes.js
const express = require("express");
const router = express.Router();
const pesananDetailController = require("../controllers/pesananDetailController");

router.post("/detail", pesananDetailController.createPesananDetail);
router.post("/header", pesananDetailController.createPesanan);

router.get("/showspesifik", pesananDetailController.showPesananDetailSpesifik);
router.post("/update/:id", pesananDetailController.updateStatusPesanan)
router.post("/passcek", pesananDetailController.cekPasswordPemesanan)

module.exports = router;
