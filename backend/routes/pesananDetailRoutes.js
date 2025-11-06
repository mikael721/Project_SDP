// routes/pesananDetailRoutes.js
const express = require("express");
const router = express.Router();
const pesananDetailController = require("../controllers/pesananDetailController");

router.post("/detail", pesananDetailController.createPesananDetail);
router.post("/header", pesananDetailController.createPesanan);
module.exports = router;
