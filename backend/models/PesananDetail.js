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

module.exports = PesananDetail;
