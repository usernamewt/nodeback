const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const NavConfig = sequelize.define("nav_config", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  img_url: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.INTEGER,
  },
  jump_address: {
    type: DataTypes.STRING,
  },
  sort: {
    type: DataTypes.INTEGER,
  },
  created_time: {
    type: DataTypes.DATE,
  },
  updated_time: {
    type: DataTypes.DATE,
  },
});
module.exports = NavConfig;
