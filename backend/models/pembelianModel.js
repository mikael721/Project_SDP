const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const HeaderPembelian = require("./headerPembelianModel");

const Pembelian = sequelize.define(
  "pembelian",
  {
    pembelian_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    header_pembelian_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "header_pembelian",
        key: "header_pembelian_id",
      },
    },
    bahan_baku_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bahan_baku",
        key: "bahan_baku_id",
      },
    },
    pembelian_jumlah: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pembelian_satuan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pembelian_harga_satuan: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: "pembelian",
    timestamps: true,
    paranoid: true,
  }
);

// Relasi
Pembelian.belongsTo(HeaderPembelian, {
  foreignKey: "header_pembelian_id",
  as: "headerPembelian",
});

HeaderPembelian.hasMany(Pembelian, {
  foreignKey: "header_pembelian_id",
  as: "detailPembelian",
});

module.exports = Pembelian;
