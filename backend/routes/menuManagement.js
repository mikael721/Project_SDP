const express = require("express");
const router = express.Router();
const menuManagement = require("../controllers/menuManagementController");
const { isAuthenticate } = require("../middleware/middleware");

router.post("/", isAuthenticate  , menuManagement.addMenu);

module.exports = router;