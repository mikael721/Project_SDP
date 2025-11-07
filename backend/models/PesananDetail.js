// models/PesananDetail.js
const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const PesananDetail = sequelize.define(
  "pesanan_detail",
  {
    pesanan_detail_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    menu_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pesanan_detail_jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pesanan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
<<<<<<< Updated upstream
=======
      references: {
        model: "pesanan",
        key: "pesanan_id",
      },
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "pesanan_detail",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = PesananDetail;
