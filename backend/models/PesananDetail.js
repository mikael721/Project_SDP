const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const Menu = require("./menuModels");
const Pesanan = require("./Pesanan");

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
      references: {
        model: "menu",
        key: "menu_id",
      },
    },
    pesanan_detail_jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pesanan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "pesanan",
        key: "pesanan_id",
      },
    },
    status: {
      type: DataTypes.ENUM("belum_jadi", "jadi"),
      allowNull: true,
      defaultValue: "belum_jadi",
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

// === Relasi ===
PesananDetail.belongsTo(Menu, {
  foreignKey: "menu_id",
  as: "menu",
});

PesananDetail.belongsTo(Pesanan, {
  foreignKey: "pesanan_id",
  as: "pesanan",
});

Menu.hasMany(PesananDetail, {
  foreignKey: "menu_id",
  as: "detailPesanan",
});

Pesanan.hasMany(PesananDetail, {
  foreignKey: "pesanan_id",
  as: "detailPesanan",
});

module.exports = PesananDetail;
