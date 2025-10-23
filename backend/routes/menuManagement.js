const express = require("express");
const router = express.Router();
const menuManagement = require("../controllers/menuManagementController");

router.post("/", menuManagement.addMenu);

module.exports = router;