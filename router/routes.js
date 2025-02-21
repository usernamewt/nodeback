require("express-async-errors");
module.exports = [
    require("./user"),
    require('./upload'),
    require('./adminRequestLog'),
    require('./role'),
    require('./permission')
]