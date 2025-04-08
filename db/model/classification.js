const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const Product = require("./goods");
const Classification = sequelize.define("classification", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  cate_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cate_img: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sort: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  state: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_time: {
    type: DataTypes.DATE,
  },
});
module.exports = Classification;
