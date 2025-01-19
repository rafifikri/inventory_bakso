import { Sequelize } from "sequelize";

export const db_inventory = new Sequelize("inventory_bakso", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
