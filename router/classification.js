const express = require("express");
const router = express.Router();
const Classification = require("../db/model/classification");
const moment = require("moment");
const {
  fail,
  success,
  successWithData,
  successWrong,
} = require("../utils/result");
const { Op } = require("sequelize");
// 分页查询所有分类
router.post("/classification/getAll", async (req, res) => {
  const { currentPage, pageSize, keyword } = req.body;
  const offset = (currentPage - 1) * pageSize;
  const where = {};
  if (keyword) {
    where.cate_name = {
      [Op.like]: `%${keyword}%`,
    };
  }
  try {
    const goods = await Classification.findAndCountAll({
      where,
      offset,
      limit: parseInt(pageSize),
      order: [["id", "DESC"]],
    });
    return res.json(successWithData(goods));
  } catch (err) {
    return res.json(fail(err));
  }
});

module.exports = router;
