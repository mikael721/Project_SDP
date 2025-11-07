<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
// models/Pesanan.js (KODE YANG SUDAH DIPERBAIKI)

const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

// HAPUS: const PesananDetail = require("./PesananDetail"); 
// HAPUS: const Menu = require("./menuModels");

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
    pesanan_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    pesanan_status: {
      type: DataTypes.ENUM("pending", "diproses", "terkirim"),
      defaultValue: "pending",
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

Pesanan.associate = function(models) {
    const PesananDetail = models.PesananDetail; // Ambil model dari parameter
    const Menu = models.Menu; // Ambil model dari parameter
    
    // Relasi Pesanan.js
    Pesanan.hasMany(PesananDetail, {
        foreignKey: "pesanan_id",
        as: "details",
    });

    // Relasi PesananDetail.js (belongsTo)
    PesananDetail.belongsTo(Pesanan, {
        foreignKey: "pesanan_id",
        as: "pesanan",
    });
    
    // Relasi Menu
    Menu.hasMany(PesananDetail, {
        foreignKey: "menu_id",
        as: "pesanan_details",
    });

    PesananDetail.belongsTo(Menu, {
        foreignKey: "menu_id",
        as: "menu",
    });
};

module.exports = Pesanan;
>>>>>>> Stashed changes
=======
// models/Pesanan.js (KODE YANG SUDAH DIPERBAIKI)

const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

// HAPUS: const PesananDetail = require("./PesananDetail"); 
// HAPUS: const Menu = require("./menuModels");

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
    pesanan_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    pesanan_status: {
      type: DataTypes.ENUM("pending", "diproses", "terkirim"),
      defaultValue: "pending",
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

Pesanan.associate = function(models) {
    const PesananDetail = models.PesananDetail; // Ambil model dari parameter
    const Menu = models.Menu; // Ambil model dari parameter
    
    // Relasi Pesanan.js
    Pesanan.hasMany(PesananDetail, {
        foreignKey: "pesanan_id",
        as: "details",
    });

    // Relasi PesananDetail.js (belongsTo)
    PesananDetail.belongsTo(Pesanan, {
        foreignKey: "pesanan_id",
        as: "pesanan",
    });
    
    // Relasi Menu
    Menu.hasMany(PesananDetail, {
        foreignKey: "menu_id",
        as: "pesanan_details",
    });

    PesananDetail.belongsTo(Menu, {
        foreignKey: "menu_id",
        as: "menu",
    });
};

module.exports = Pesanan;
>>>>>>> Stashed changes
