const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const BahanBaku = sequelize.define(
  "bahan_baku",
  {
    bahan_baku_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bahan_baku_nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bahan_baku_jumlah: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    bahan_baku_harga: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bahan_baku_satuan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bahan_baku_harga_satuan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "bahan_baku",
    timestamps: false,
  }
);

module.exports = BahanBaku;
