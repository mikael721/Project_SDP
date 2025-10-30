const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const HeaderPenjualan = sequelize.define(
  "header_penjualan",
  {
    header_penjualan_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    header_penjualan_tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    header_penjualan_jenis: {
      type: DataTypes.ENUM('offline', 'online'),
      allowNull: false,
    },
    header_penjualan_keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    header_penjualan_biaya_tambahan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    header_penjualan_uang_muka: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    tableName: "header_penjualan",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = HeaderPenjualan;