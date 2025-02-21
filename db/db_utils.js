let mysql = require("mysql2");
const db = require("../const/sequelize");

let db_config = {
  host: db.HOST,
  port: "3306",
  user: db.USER,
  password: db.PASSWORD,
  database: db.DATABASE, // The name of the database
  connectTimeout: 5000, //Sets the connection timeout
  multipleStatements: false, //Whether to allow a query contains multiple SQL statements
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('连接错误,准备重连:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('连接错误', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();


module.exports = connection;