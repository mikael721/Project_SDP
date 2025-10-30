const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const HeaderPenjualan = require("./headerPenjualanModel");
const Menu = require("./menuModels");

const Penjualan = sequelize.define(
  "penjualan",
  {
    penjualan_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    header_penjualan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "header_penjualan",
        key: "header_penjualan_id",
      },
    },
    menu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "menu",
        key: "menu_id",
      },
    },
    penjualan_jumlah: {
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
    tableName: "penjualan",
    timestamps: true,
    paranoid: true,
  }
);

// Relasi
Penjualan.belongsTo(HeaderPenjualan, {
  foreignKey: "header_penjualan_id",
  as: "headerPenjualan",
});

Penjualan.belongsTo(Menu, {
  foreignKey: "menu_id",
  as: "menu",
});

HeaderPenjualan.hasMany(Penjualan, {
  foreignKey: "header_penjualan_id",
  as: "detailPenjualan",
});

module.exports = Penjualan;
