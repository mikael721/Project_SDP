const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./config/sequelize");

// Routes
const bahanBakuRoutes = require("./routes/bahanBakuRoutes");
const loginRoutes = require("./routes/loginRoutes");
const menuManagementRoutes = require("./routes/menuManagement");
const detailMenuRoutes = require("./routes/detailMenuRoutes");
const pesananDetailRoutes = require("./routes/pesananDetailRoutes");
const mainPenjualanRoutes = require("./routes/mainPenjualanRoutes");
const detailPenjualanRoutes = require("./routes/detailPenjualanRoutes");
const laporanKeuanganRoutes = require("./routes/laporanKeuanganRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/login", loginRoutes);
app.use("/api/menu_management", menuManagementRoutes);
app.use("/api/menu_management/detail", detailMenuRoutes);
<<<<<<< Updated upstream
app.use("/api/bahan_baku", bahanBakuRoutes);
app.use("/api/pesanan_detail", pesananDetailRoutes); // endpoint untuk pesanan detail
app.use("/api/main_penjualan", mainPenjualanRoutes);
=======

// bahan baku
app.use("/api/bahan_Baku", bahanBakuRoutes);

// pesanan detail
app.use("/api/pesanan_detail/detail", pesananDetailRoutes);

// ====================================================================

// main penjualan (header penjualan)
app.use("/api/main_penjualan", mainPenjualanRoutes);


// detail penjualan
>>>>>>> Stashed changes
app.use("/api/detail_penjualan", detailPenjualanRoutes);
app.use("/api/laporan_keuangan", laporanKeuanganRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log(`Server is running on port ${PORT}`);
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
