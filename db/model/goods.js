const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const Classific = require("../model/classification");
const Classification = require("../model/classification");
const Product = sequelize.define("product", {
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
    // references: {
    //   model: "classification", // 关联表名
    //   key: "id", // 关联字段
    // },
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
// 多对一关联：belongsTo
Product.belongsTo(Classification, {
  foreignKey: "cate_id",
  targetKey: "id",
});
module.exports = Product;
