const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const User = require("../db/model/userModel");
const Role = require("../db/model/roleModel");
const Permission = require("../db/model/permissionModel");
const { successWithData, fail } = require("../utils/result");
const { getTree } = require("../utils/base");

// 添加权限
router.post("/permission/add", (req, res) => {
  try {
    Permission.create({
      ...req.body,
      create_time: Date.now(),
      updated_time: Date.now(),
    }).then((data) => {
      res.json(successWithData(data, "添加成功"));
    });
  } catch (error) {
    res.json(fail(error, "添加失败"));
  }
});

// 删除权限
router.post("/permission/delete", (req, res) => {
  if (!req.body.id) {
    return res.json(fail(null, "缺少参数"));
  }
  try {
    Permission.destroy({ where: { id: req.body.id } }).then((data) => {
      res.json(successWithData(data, "删除成功"));
    });
  } catch (error) {
    res.json(fail(error, "删除失败"));
  }
});

// 查询用户权限
router.post("/permission/queryByUser", async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.json({
      code: -1,
      msg: "缺少参数",
    });
  }
  const user = await User.findByPk(user_id);
  if (!user) {
    return res.json({ code: -1, msg: "用户不存在" });
  }
  const role = await Role.findByPk(user.dataValues.role_id);
  if (!role) {
    return res.json({ code: -1, msg: "用户没有角色" });
  }
  let permissionList = role.dataValues.permission_ids.split(",");
  if (!permissionList.length) {
    return res.json({ code: -1, msg: "用户没有权限" });
  }
  // permissionList = permissionList.map(item=>Number(item));
  console.log(permissionList);
  let pDate = [];
  if (user.dataValues.id == 1) {
    pDate = await Permission.findAll();
  } else {
    pDate = await Permission.findAll({
      where: {
        id: {
          [Op.in]: permissionList,
        },
      },
    });
  }

  if (!pDate.length) {
    return res.json({ code: -1, msg: "用户没有权限" });
  }
  pDate = pDate.map((item) => {
    return item.dataValues;
  });
  console.log(pDate);
  // 组装鉴权
  let data = [];
  let formData = pDate.map((o) => {
    return {
      id: o.id,
      index: o.index,
      title: o.title,
      icon: o.icon,
      fid: o.fid,
      component: o.component,
      level: o.level,
    };
  });
  getTree(0, formData, data);
  return res.json(successWithData(data));
});

// 查询角色权限
router.post("/permission/queryByRole", async (req, res) => {
  try {
    let { role_id } = req.body;
    if (!role_id) {
      return res.send({ code: 500, msg: "缺少role_id参数" });
    }
    // 查询角色信息
    let role = (await Role.findByPk(role_id)).dataValues;
    // console.log("role", role);
    if (!role) {
      return res.send({ code: 500, msg: "角色数据异常" });
    }
    if (!role.permission_ids) {
      return res.json({ code: 200, message: "success", data: [] });
    }
    let permission_ids_arr = role.permission_ids
      .split(",")
      .map((o) => parseInt(o));
    // console.log("permission_ids_arr", permission_ids_arr);
    // 查询权限
    let result = await Permission.findAll({
      where: {
        id: {
          [Op.in]: permission_ids_arr,
        },
      },
      order: [["sort", "DESC"]],
    });
    if (!result || result.length == 0) {
      return res.json({ code: 200, message: "seccusee", data: [] });
    }
    let resData = result.map((o) => o.dataValues);
    let data = [];
    getTree(0, resData, data);

    // 查询所有权限
    let allResult = await Permission.findAll({
      order: [["sort", "DESC"]],
    });
    if (!allResult || allResult.length == 0) {
      return res.json({ code: 200, message: "success", data: [] });
    }
    let addResData = allResult.map((o) => o.dataValues);
    let allData = [];
    getTree(0, addResData, allData);

    let clearIds = [];
    // 遍历所有权限，如果
    allData.forEach((permission) => {
      if (permission_ids_arr.indexOf(permission.id) != -1) {
        if (permission.subs && permission.subs.length > 0) {
          permission.subs.forEach((two) => {
            if (permission_ids_arr.indexOf(two.id) == -1) {
              // 需要删除父级，因为不是全选
              if (clearIds.indexOf(permission.id) == -1) {
                clearIds.push(permission.id);
              }
            } else {
              if (two.subs && two.subs.length > 0) {
                two.subs.forEach((third) => {
                  if (permission_ids_arr.indexOf(third.id) == -1) {
                    // 需要删除二级，因为不是全选
                    if (clearIds.indexOf(two.id) == -1) {
                      clearIds.push(two.id);
                    }
                    if (clearIds.indexOf(permission.id) == -1) {
                      clearIds.push(permission.id);
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
    return res.json({
      code: 200,
      message: "查询成功",
      //   过滤掉需要删除的id
      data: permission_ids_arr.filter((o) => clearIds.indexOf(o) == -1),
    });
  } catch (err) {
    return res.json({
      code: 500,
      message: "查询失败:" + err,
    });
  }
});

// 查询所有权限
router.get("/permission/all", async (req, res) => {
    try{
        let result = await Permission.findAll();
        if (!result || result.length == 0) {
            return res.json({code:-1,msg:"没有权限"});
        }
        let data = [];
        let resData = result.map((o) => o.dataValues);
        getTree(0, resData, data);
        return res.json(successWithData(data));

    }
    catch (err) {
        return res.json(fail(err));
    }
})

module.exports = router;
