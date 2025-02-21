// 枚举

const HOST = process.env.HOST || "localhost";
const DATABASE = process.env.DATABASE || "mail";
const USER = process.env.USER || "root";
const PASSWORD = process.env.PASSWORD || "systemwang122";
const PORT = process.env.PORT || 3306;
db = {
  HOST,
  DATABASE,
  USER,
  PASSWORD,
  PORT,
};
module.exports = db;
