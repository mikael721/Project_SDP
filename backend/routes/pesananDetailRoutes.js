// routes/pesananDetailRoutes.js
const express = require("express");
const router = express.Router();
const pesananDetailController = require("../controllers/pesananDetailController");

router.post("/detail", pesananDetailController.createPesananDetail);
router.post("/header", pesananDetailController.createPesanan);
<<<<<<< Updated upstream
=======

router.get("/showspesifik", pesananDetailController.showPesananDetailSpesifik); // udh bisa
router.post("/update/:id", pesananDetailController.updateStatusPesanan) // udh bisa
router.post("/passcek", pesananDetailController.cekPasswordPemesanan) // udh bisa

>>>>>>> Stashed changes
module.exports = router;
