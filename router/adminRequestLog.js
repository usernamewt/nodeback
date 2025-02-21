const express = require("express");
const router = express.Router();
const { success, successWithData, fail } = require("../utils/result");
const { check } = require("express-validator");
const { checkParam } = require("../utils/base");
const AdminRequestLog = require("../db/model/adminRequestLogModel");

router.post("/adminRequestLog/add", async function (req, res) {
    await AdminRequestLog.create({ ...req.body });
    return res.json(success());
  });

module.exports = router;