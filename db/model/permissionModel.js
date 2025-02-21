const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const Permission = sequelize.define("permission", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  fid: {
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING,
  },
  index: {
    type: DataTypes.STRING,
  },
  sort: {
    type: DataTypes.INTEGER,
  },
  mark: {
    type: DataTypes.STRING,
  },
  level: {
    type: DataTypes.INTEGER,
  },
  icon: {
    type: DataTypes.STRING,
  },
  component: {
    type: DataTypes.STRING,
  },
});

module.exports = Permission;
