import { Sequelize } from "sequelize";
import { db_inventory } from "../config/database.js";

const { DataTypes } = Sequelize;

const Nominal_stok = db_inventory.define(
  "nominal_stok_harian",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_specific_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal: DataTypes.DATE,
    jenis: DataTypes.STRING,
    produksi: DataTypes.INTEGER,
    kuantitas: DataTypes.INTEGER,
    hpp_lama: DataTypes.FLOAT,
    hpp_baru: DataTypes.FLOAT,
    sisa_stok: DataTypes.INTEGER,
    nominal_sisa_stok: DataTypes.FLOAT,
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Nominal_stok;
