#!/usr/bin/env nod

/**
 * Module dependencies.
 */
var app = require("./app");
var http = require("http");

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

var io = require("socket.io")(server, {
  cors: {
    origin: "*", // 允许所有来源的跨域请求
    methods: ["GET", "POST"], // 允许的方法，默认是所有方法
    allowedHeaders: ["my-custom-header"], // 允许的自定义请求头
    credentials: true, // 允许发送 Cookies 等身份凭证信息
  },
});
io.use(async (socket, next) => {
  if (socket.request._query.atoy) {
    socket.cookies = socket.request._query.atoy;
    next();
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", function (socket) {
  socket.emit("message", { hello: "world" });
  socket.on("message", function (data) {
    console.log(socket.cookies);
    console.log(data);
  });
  socket.on('boardcast',()=>{
    io.emit('boardcast', 'boardcast')
  })
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("server start Listening on " + bind);
}
