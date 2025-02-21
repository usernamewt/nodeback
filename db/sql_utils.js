const connection = require("./db_utils");
const sqls = {
  // 注册用户
  register:
    "insert into user (username,password,created_time,state,role_id,nickname) value (?,?,?,?,?,?)",
  // 查询用户
  loginUser: "select * from user where username  = ?",
};
//execute sql
const conn_query = function (req, res, sql, params) {
  connection.query(sql, params, function (err, result) {
    if (err) return res.json({ code: 500, message: err });
    console.log("conn_query data:", req.data);
    return res.json({ code: 200, message: "success", data: result });
  });
};
//query by page
const get_data_conn = function (req, res, sql, params, sub_sql, sub_params) {
  connection.query(sub_sql, params, function (err, among) {
    console.log('among');
    
    if (err) return res.json({ code: 500, message: err });
    let total = among[0]["total"];
    connection.query(sql, params, function (err, result) {
      if (err) return res.json({ code: 500, message: err });
      return res.json({
        code: 200,
        message: "success",
        data: result,
        paging: {
          page: parseInt(sub_params[0]),
          size: parseInt(sub_params[1]),
          total: total,
        },
      });
    });
  });
};
module.exports = {
  sqls,
  conn_query,
  get_data_conn,
};
