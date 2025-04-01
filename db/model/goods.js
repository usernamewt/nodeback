const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const Goods = sequelize.define("product", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  product_name: {
    type: DataTypes.STRING,
  },
  detail: {
    type: DataTypes.STRING,
  },
  is_hot: {
    type: DataTypes.INTEGER,
  },
  sale_price: {
    type: DataTypes.DECIMAL,
  },
  original_price: {
    type: DataTypes.DECIMAL,
  },
  head_img: {
    type: DataTypes.STRING,
  },
  carousel_img: {
    type: DataTypes.STRING,
  },
  cate_id: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.INTEGER,
  },
  stock: {
    type: DataTypes.INTEGER,
  },
  version: {
    type: DataTypes.INTEGER,
  },
  created_time: {
    type: DataTypes.DATE,
  },
  updated_time: {
    type: DataTypes.DATE,
  },
  description: {
    type: DataTypes.STRING,
  },
});
module.exports = Goods;
