const { Sequelize } = require("sequelize");

const db = require("../enum/dbconfig");
const sequelize = new Sequelize(db.DATABASE, db.USER, db.PASSWORD, {
  host: db.HOST,
  port: db.PORT,
  dialect: "mysql",
  timezone: "+08:00",
  define: {
    freezeTableName: true,
    createdAt: "created_time",
    updatedAt: "updated_time",
  },
  dialectOptions: {
    charset: "utf8mb4",
    dateStrings: true,
    typeCast: true,
  },
});
module.exports = sequelize;
