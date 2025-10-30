const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const HeaderPembelian = sequelize.define(
  "header_pembelian",
  {
    header_pembelian_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    header_pembelian_tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    header_pembelian_keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    header_pembelian_biaya_tambahan: {
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
    tableName: "header_pembelian",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = HeaderPembelian;
