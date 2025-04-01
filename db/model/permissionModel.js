const Role = require("./roleModel");
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
  sort: {
    type: DataTypes.INTEGER,
  },
  level: {
    type: DataTypes.INTEGER,
  },
  icondef: {
    type: DataTypes.STRING,
  },
  iconact: {
    type: DataTypes.STRING,
  },
  component: {
    type: DataTypes.STRING,
  },
  perms: {
    type: DataTypes.STRING,
  },
  created_time: {
    type: DataTypes.DATE,
  },
  updated_time: {
    type: DataTypes.DATE,
  },
  mark: {
    type: DataTypes.STRING,
  },
  isFrame: {
    type: DataTypes.INTEGER,
  },
  path: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.INTEGER,
  },
  is_hidden: {
    type: DataTypes.INTEGER,
  },
});
module.exports = Permission;
