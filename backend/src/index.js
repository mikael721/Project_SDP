//npm init -y
//npm i sequelize mysql2 express
  
const express = require("express");
const bodyParser = require("body-parser");
const bukuRoutes = require("../routes/pengunjung");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", bukuRoutes);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
