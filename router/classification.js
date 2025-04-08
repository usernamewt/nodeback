const express = require("express");
const router = express.Router();
const Classification = require("../db/model/classification");
const moment = require("moment");
const { fail, successWithData } = require("../utils/result");
const { Op } = require("sequelize");
// 分页查询所有分类
router.post("/classification/getAll", async (req, res) => {
  try {
    const goods = await Classification.findAndCountAll({
      order: [["sort", "ASC"]],
    });
    return res.json(successWithData(goods));
  } catch (err) {
    return res.json(fail(err));
  }
});
// 添加分类
router.post("/classification/add", async (req, res) => {
  const { cate_name, cate_img, sort, state } = req.body;
  try {
    const classification = await Classification.create({
      cate_name,
      cate_img,
      sort,
      state,
      created_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      updated_time: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return res.json(successWithData(classification));
  } catch (err) {
    return res.json(fail(err));
  }
});

// 修改分类
router.post("/classification/update", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.json(fail("id不能为空"));
  }
  try {
    const classification = await Classification.update(
      {
        ...req.body,
      },
      {
        where: {
          id,
        },
      }
    );
    return res.json(successWithData(classification));
  } catch (err) {
    return res.json(fail(err));
  }
});

// 删除分类
router.post("/classification/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const classification = await Classification.destroy({
      where: {
        id,
      },
    });
    return res.json(successWithData(classification));
  } catch (err) {
    return res.json(fail(err));
  }
});

module.exports = router;
