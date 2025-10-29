// routes/pesananDetailRoutes.js
const express = require("express");
const router = express.Router();
const pesananDetailController = require("../controllers/pesananDetailController");
const pesananDetailValidation = require("../validations/pesananDetailValidation");

router.get("/", pesananDetailController.getAllPesananDetails);

router.get("/:id", pesananDetailController.getPesananDetailById);

router.get(
  "/pesanan/:pesanan_id",
  pesananDetailController.getPesananDetailsByPesananId
);

router.post(
  "/",
  pesananDetailValidation.createPesananDetail,
  pesananDetailController.createPesananDetail
);

router.put(
  "/:id",
  pesananDetailValidation.updatePesananDetail,
  pesananDetailController.updatePesananDetail
);

router.delete("/:id", pesananDetailController.deletePesananDetail);

router.post("/:id/restore", pesananDetailController.restorePesananDetail);

module.exports = router;
