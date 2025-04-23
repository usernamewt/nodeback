#!/usr/bin/env nod

/**
 * Module dependencies.
 */
var app = require("./app");
var http = require("http");
const ChatInfo = require("./db/model/chatInfo");
let vertoken = require("./token/index");

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || "8082");
app.set("port", port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
let onlineUsers = new Map();
let io = require("socket.io")(server, {
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

io.on("connection", (socket) => {
  let currentUserId = null;

  // 用户身份验证（假设前端在连接后发送用户ID）
  socket.on("authenticate", (userId) => {
    let id = userId.userId;
    currentUserId = id;
    onlineUsers.set(id, socket.id);
  });

  // 处理私聊消息
  socket.on("private_message", async ({ toUserId, message }) => {
    if (!currentUserId) {
      return socket.emit("error", "未验证的用户");
    }
    const targetSocketId = onlineUsers.get(toUserId);
    if (targetSocketId!=undefined) {
      try {
        // 生成唯一的消息ID
        const messageId = `${currentUserId}_${toUserId}_${Date.now()}`;
        
        // 创建消息对象
        const messageData = {
          code: 0,
          from: currentUserId,
          message,
          timestamp: Date.now(),
          id: messageId
        };

        // 发送给目标用户
        io.to(targetSocketId).emit('new_message', messageData);
        
        // 发送给发送者自己（用于确认消息已发送）
        socket.emit('new_message', {
          ...messageData,
          isUser: true
        });
      
        // 保存到数据库
        await ChatInfo.create({
          from_id: currentUserId,
          to_id: toUserId,
          content: message,
          create_time: Date.now(),
          message_id: messageId
        });
      } catch(e) {
        console.error('消息发送错误:', e);
        socket.emit("new_message", { code: -1, message: "发送失败" });
      }
    } else {
      socket.emit("message",{ code: -1, message: "对方当前不在线" });
    }
  });

  // 处理断开连接
  socket.on("disconnect", () => {
    if (currentUserId) {
      onlineUsers.delete(currentUserId);
    }
  });
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
  const port = parseInt(val, 10);
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
      process.exit(1);
      break;
    case "EADDRINUSE":
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
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("server start Listening on " + bind);
}
