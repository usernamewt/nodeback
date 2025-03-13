const cors = require("cors");
let createError = require("http-errors");
let express = require("express");
let path = require("node:path");
let app = express();
let vertoken = require("./token/index");
let expressJwt = require("express-jwt");
let cookieParser = require("cookie-parser");
let moment = require("moment");
const routes = require("./router/routes");
const AdminRequestLog = require("./db/model/adminRequestLogModel");
const { getClientIp } = require("./utils/base");
// app.use(cors({
//   origin: 'http://47.120.49.37:8080' // 允许来自 localhost:3000 的请求
// }));
// let mine = require('mime')

// 跨域
app.all("*", (req, res, next) => {
  const allowedOrigins = [
    "http://47.120.49.37:8080",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:8082",
    "http://localhost:8000"
  ];
  try {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", `${origin}`);
    }
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Expose-Headers", "Authorization");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.url.includes("/images")) {
      res.header("Content-Type", mime.getType(req.url));
    } else if (req.url.includes("/apidoc/")) {
      res.header("Content-Type", mime.getType(req.url));
    } else if (req.url.includes("/admin/")) {
      res.header("Content-Type", mime.getType(req.url));
    } else {
      res.header("Content-Type", "text/html;charset=utf-8");
    }
  } catch (error) {
    console.log("跨域设置错误");
  }
  next();
});

// 日志拦截

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 设置托管静态目录; 项目根目录+ public.可直接访问public文件下的文件eg:http://localhost:3000/images/url.jpg
app.use(express.static(path.join(__dirname, "public")));
console.log("process.env.environment:", process.env.environment);
if (process.env.environment && process.env.environment === "PRO") {
  app.use("/images", express.static(path.join("/root/images")));
}

// jwt鉴权
app.use(async (req, res, next) => {
  const token = req.header("authorization");
  if (token === undefined) {
    return next();
  } else {
    let verify = await vertoken.getToken(token);
    if (verify) {
      return next();
    } else {
      return next();
    }
  }
});

// 校验token，获取headers⾥里里的Authorization的token，要写在路由加载之前，静态资源之后
// 测试的时候可以注释
app.use(
  expressJwt({ secret: "gnotgnaw", algorithms: ["HS256"] }).unless({
    path: [
      "/user/login",
      "/user/register",
      "/config/queryValueByKey",
      "/checkHealth",
      "/user/logout",
      "/api/upload"
    ],
  })
);

app.use((req, res, next) => {
  const defaultWrite = res.write;
  const defaultEnd = res.end;
  const chunks = [];
  res.write = (...restArgs) => {
    chunks.push(Buffer.from(restArgs[0]));
    defaultWrite.apply(res, restArgs);
  };
  res.end = (...restArgs) => {
    let mList = ["POST", "GET"];
    if (mList.indexOf(req.method) !== -1) {
      if (restArgs[0]) {
        chunks.push(Buffer.from(restArgs[0]));
      }
      const body = Buffer.concat(chunks).toString("utf8");
      const time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      const blacklist = ["/adminRequestLog/queryAdminRequestLogListByPage"];
      if (blacklist.indexOf(req.url) === -1) {
        AdminRequestLog.create({
          user_id: req.data && req.data.user_id ? req.data.user_id : null,
          username: req.data && req.data.username ? req.data.username : null,
          url: req.url,
          method: req.method,
          body: JSON.stringify(req.body),
          params: "",
          ip_address: getClientIp(req),
          result: JSON.stringify(body),
          create_time: time,
          updated_time: time,
        });
      }
    }
    defaultEnd.apply(res, restArgs);
  };
  next();
});

routes.forEach((router) => {
  app.use("/", router);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// token失效返回信息
app.use(function (err, req, res, next) {
  console.log(req.file);
  console.log("=====================》err:", err);
  try {
    if (err.status === 401) {
      return res.json({ code: 401, message: "token Invalid" });
    }
    if (err.message.indexOf("BadRequestError") !== -1) {
      return res.json({ code: 400, message: err.message.split("#")[1] });
    }
  } catch (error) {
    return res.json({ code: 500, message: "服务器异常" });
  }

  return res.json({ code: 500, message: "服务器异常" });
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
