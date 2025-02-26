require("express-async-errors");
module.exports = [
    require("./user").router,
    require('./upload'),
    require('./adminRequestLog'),
    require('./role'),
    require('./permission')
]