const express = require("express");
const router = express.Router();
const detailMenuController = require("../controllers/detailMenuController");
const detailMenuValidation = require("../validations/detailMenuValidation");

router.post(
  "/",
  detailMenuValidation.create,
  detailMenuController.createDetailMenu
);
router.get("/", detailMenuController.getAllDetailMenu);
router.get("/:id", detailMenuController.getDetailMenuById);
router.put(
  "/:id",
  detailMenuValidation.update,
  detailMenuController.updateDetailMenu
);
router.delete("/:id", detailMenuController.deleteDetailMenu);

module.exports = router;
