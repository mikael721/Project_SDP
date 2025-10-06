const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "db_pengunjung", // database name
  "root", // database username
  "", // database password
  {
  host: "localhost",
  dialect: "mysql", 
});

async function testDB() { // test database connection
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (error) {
    console.error("Connection error:", error);
  }
}

testDB();

module.exports = { sequelize }; // export the sequelize object
