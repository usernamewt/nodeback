const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const AdminRequestLog = sequelize.define("admin_request_log", {
  /**
   * 主键
   */
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  /**
   * 用户id
   */
  user_id: {
    type: DataTypes.INTEGER,
  },
  /**
   * 用户名
   */
  username: {
    type: DataTypes.STRING,
  },
  /**
   * 请求地址
   */
  url: {
    type: DataTypes.STRING,
  },
  /**
   * 请求方式
   */
  method: {
    type: DataTypes.STRING,
  },
  /**
   * 请求body
   */
  body: {
    type: DataTypes.STRING,
  },
  /**
   * 请求params
   */
  params: {
    type: DataTypes.STRING,
  },
  /**
   * ip地址
   */
  ip_address: {
    type: DataTypes.STRING,
  },
  /**
   * 响应内容
   */
  result: {
    type: DataTypes.TEXT,
  },
});
module.exports = AdminRequestLog;
