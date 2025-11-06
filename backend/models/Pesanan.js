// models/Pesanan.js
const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Pesanan = sequelize.define(
  "pesanan",
  {
    pesanan_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pesanan_nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pesanan_lokasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pesanan_tanggal: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pesanan_tanggal_pengiriman: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "pesanan",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Pesanan;
