const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./config/sequelize");
const bahanBakuRoutes = require("./routes/bahanBakuRoutes");
const login = require("./routes/loginRoutes");
const menuManagement = require("./routes/menuManagement");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // ini biar bisa terima body !!!

// ===================================================================
// menu management
app.use("/api/menu_management", menuManagement);

// login
app.use("/api/login", login);

// bahan baku
app.use("/api/bahan_Baku", bahanBakuRoutes);
// ====================================================================

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
