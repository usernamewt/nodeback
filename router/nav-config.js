const express = require("express");
const router = express.Router();
const NavConfig = require("../db/model/nav_config");
const moment = require("moment");
const {
  fail,
  success,
  successWithData,
  successWrong,
} = require("../utils/result");
const { Op } = require("sequelize");
// 分页查询所有轮播图
router.post("/nav/getAll", async (req, res) => {
  try {
    const goods = await NavConfig.findAll();
    return res.json(successWithData(goods));
  } catch (err) {
    return res.json(fail(err));
  }
});

// 编辑所有轮播图
router.post("/nav/edit", async (req, res) => {
  try {
    const { id, title, img_url, type, jump_address, sort } = req.body;

    if (!id) {
      return res.json(successWrong("id不能为空"));
    }
    const goods = await NavConfig.findOne({
      where: {
        id,
      },
    });
    if (goods) {
      goods.title = title;
      goods.img_url = img_url;
      goods.type = type;
      goods.jump_address = jump_address;
      goods.sort = sort;
      goods.updated_time = moment().format("YYYY-MM-DD HH:mm:ss");
      await goods.save();
      return res.json(success());
    } else {
      return res.json(successWrong("没有该轮播图"));
    }
  } catch (err) {
    return res.json(fail(err));
  }
});

// 添加轮播图
router.post("/nav/add", async (req, res) => {
  try {
    const { title, img_url, type, jump_address, sort } = req.body;
    if (!title) {
      return res.json(successWrong("标题不能为空"));
    }
    if (!img_url) {
      return res.json(successWrong("图片不能为空"));
    }
    const goods = await NavConfig.create({
      title,
      img_url,
      type,
      jump_address,
      sort,
      created_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      updated_time: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return res.json(successWithData(goods));
  } catch (err) {
    return res.json(fail(err));
  }
});

// 删除轮播图
router.post("/nav/delete", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.json(successWrong("id不能为空"));
    }
    const goods = await NavConfig.findOne({
      where: {
        id,
      },
    });
    if (goods) {
      await goods.destroy();
      return res.json(success());
    }
  } catch (err) {
    return res.json(fail(err));
  }
});

module.exports = router;
