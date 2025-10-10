const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables

const sequelize = new Sequelize(
  process.env.DB_NAME, // database name
  process.env.DB_USER, // database username
  process.env.DB_PASSWORD, // database password
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

async function testDB() {
  // test database connection
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (error) {
    console.error("Connection error:", error);
  }
}

testDB();

module.exports = { sequelize }; // export the sequelize object
