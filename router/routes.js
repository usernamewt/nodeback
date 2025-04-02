require("express-async-errors");
module.exports = [
  require("./user").router,
  require("./upload"),
  require("./adminRequestLog"),
  require("./role"),
  require("./permission"),
  require("./chat_info"),
  require("./goods"),
  require("./classification"),
  require("./nav-config"),
];
