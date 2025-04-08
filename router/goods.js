const express = require("express");
const router = express.Router();
const Product = require("../db/model/goods");
const chat = require("../db/model/chatInfo");
const Classification = require("../db/model/classification");
const moment = require("moment");
const {
  fail,
  success,
  successWithData,
  successWrong,
} = require("../utils/result");
const { Op } = require("sequelize");
// 分页查询所有商品
router.post("/goods/getAll", async (req, res) => {
  const { currentPage, pageSize, keyword } = req.body;
  const offset = (currentPage - 1) * pageSize;
  const where = {};
  if (keyword) {
    where.product_name = {
      [Op.like]: `%${keyword}%`,
    };
  }
  try {
    const goods = await Product.findAndCountAll({
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

// 查询所有上架商品
router.post("/goods/getOnSale", async (req, res) => {
  const { currentPage, pageSize, keyword } = req.body;
  const offset = (currentPage - 1) * pageSize;
  const where = {
    status: 1,
  };
  if (keyword) {
    where.product_name = {
      [Op.like]: `%${keyword}%`,
    };
    where.status = 1;
  }
  try {
    const goods = await Product.findAndCountAll({
      where,
      offset,
      limit: parseInt(pageSize),
    });
    return res.json(successWithData(goods));
  } catch (err) {
    return res.json(fail(err));
  }
});

// 添加商品
router.post("/goods/add", async (req, res) => {
  const {
    product_name,
    detail,
    is_hot,
    sale_price,
    original_price,
    head_img,
    carousel_img,
    cate_id,
    status,
    stock,
    version,
    description,
  } = req.body;
  console.log(req.body);

  try {
    const goods = await Product.create({
      product_name,
      detail,
      is_hot,
      sale_price,
      original_price,
      head_img,
      carousel_img,
      cate_id,
      status,
      stock,
      version,
      description,
      created_time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      updated_time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    });
    if (goods) {
      return res.json(success("添加商品成功"));
    }
    return res.json(fail("添加商品失败"));
  } catch (err) {
    return res.json(fail(err));
  }
});

// 编辑商品
router.post("/goods/edit", async (req, res) => {
  const {
    id,
    product_name,
    detail,
    is_hot,
    sale_price,
    original_price,
    head_img,
    carousel_img,
    cate_id,
    status,
    stock,
    version,
    description,
  } = req.body;
  if (!id) {
    return res.json(successWrong("缺少id"));
  }
  try {
    const goods = await Product.update(
      {
        product_name,
        detail,
        is_hot,
        sale_price,
        original_price,
        head_img,
        carousel_img,
        cate_id,
        status,
        stock,
        version,
        description,
        updated_time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        where: {
          id,
        },
      }
    );
    return res.json(success("编辑商品成功"));
  } catch (err) {
    return res.json(fail(err));
  }
});
// 删除商品
router.post("/goods/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.json(successWrong("缺少id"));
  }
  try {
    const goods = await Product.destroy({
      where: {
        id,
      },
    });
    return res.json(success("删除商品成功"));
  } catch (err) {
    return res.json(fail(err));
  }
});

// 上/下架商品
router.post("/goods/changeStatus", async (req, res) => {
  const { id, status } = req.body;
  if (!id) {
    return res.json(successWrong("缺少id"));
  }
  try {
    await Product.update(
      {
        status,
        updated_time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        where: {
          id,
        },
      }
    );
    return res.json(success("操作成功"));
  } catch (err) {
    return res.json(fail(err));
  }
});

// 根据所有分类返回分类下5条商品
router.post("/goods/getByCate", async (req, res) => {
  try {
    const goods = await Product.findAll({
      order: [["sale_price", "DESC"]],
      include: [
        {
          association: Product.belongsTo(Classification, {
            foreignKey: "cate_id",
          }),
        },
      ],
    });
    return res.json(successWithData(goods));
  } catch (err) {
    return res.json(fail(err));
  }
});

// 根据id返回商品详情
router.post("/goods/getById", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.json(successWrong("缺少id"));
  }
  try {
    const goods = await Product.findOne({
      where: {
        id,
      },
    });
    return res.json(successWithData(goods));
  } catch (err) {
    return res.json(fail(err));
  }
});

module.exports = router;
