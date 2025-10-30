const express = require("express");
const router = express.Router();
const menuManagement = require("../controllers/menuManagementController");
const { isAuthenticate } = require("../middleware/middleware");

router.post("/", isAuthenticate  , menuManagement.addMenu);
router.get("/getall", isAuthenticate  , menuManagement.getMenu);

router.put("/status/:id", isAuthenticate  , menuManagement.ubahStatus);



module.exports = router;