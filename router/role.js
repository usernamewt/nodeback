const express = require("express");
const router = express.Router();
const Role = require("../db/model/roleModel");
const { getCurrentTime } = require("../utils/base");
const { fail, success, successWithData,successWrong } = require("../utils/result");

// 添加角色
router.post("/role/addRole", async (req, res) => {
  let { role_name, desc, permission_ids } = req.body;
  let roleExit = await Role.findAll({ where: { role_name: role_name } });
  console.log(roleExit);
  if (roleExit.length) {
    return res.json(successWrong("角色已存在"));
  }
  try {
    let createRole = await Role.create({
      role_name,
      state: 1,
      desc,
      permission_ids,
      created_time: getCurrentTime(),
      updated_time: getCurrentTime(),
    });
    if (createRole) {
      return res.json(success("添加成功"));
    }
  } catch (e) {
    res.json(fail(e));
  }
});
// 编辑角色
router.post("/role/editRole", async (req, res) => {
  let id = req.body.id;
  if (!id) {
    return res.json(successWrong("id不能为空"));
  }
  let { role_name, state, desc, permission_ids } = req.body;
  try {
    let role = await Role.findOne({ where: { id } });
    if (!role) {
      return res.json(successWrong("角色不存在"));
    }
    let data = role.dataValues;
    if (role_name) {
      data.role_name = role_name;
    }
    if (state) {
      data.state = state;
    }
    if (desc) {
      data.desc = desc;
    }
    if (permission_ids) {
      data.permission_ids = permission_ids;
    }
    data.updated_time = getCurrentTime();
    let roleupdated = await Role.update(data, { where: { id: id } });
    if (roleupdated) {
      return res.json(success("修改成功"));
    }
  } catch (e) {
    return res.json(fail(e));
  }
});

// 删除角色
router.post("/role/delRole", async (req, res) => {
  let id = req.body.id;
  if (!id) {
    return res.json(successWrong("id不能为空"));
  }
  try {
    let role = await Role.findOne({ where: { id } });
    if (!role) {
      return res.json(successWrong("角色不存在"));
    }
    let roleDel = await Role.destroy({ where: { id: id } });
    if (roleDel) {
      return res.json(success("删除成功"));
    }
  } catch (e) {
    return res.json(fail(e));
  }
});

// 设置role权限
// 分页查询role列表
router.post("/role/getRoleList", async (req, res) => {
  let { currentPage, pageSize, role_name } = req.body;
  let limit = pageSize;
  let offset = (currentPage - 1) * pageSize;
  let where = {};
  if (role_name) {
    where["role_name"] = {
      [Op.like]: `%${role_name}%`,
    };
  }
  try {
    let roleList = await Role.findAndCountAll({
      limit,
      offset,
      order: [["created_time", "DESC"]],
      where,
    });
    return res.json(successWithData(roleList));
  } catch (e) {
    return res.json(fail(e));
  }
});

// 分配角色权限相当于只有permisssion_ids的编辑
router.post("/role/setRolePermission", async (req, res) => {
  let id = req.body.id;
  if (!id) {
    return res.json(successWrong("id不能为空"));
  }
  let { permission_ids } = req.body;
  try {
    let role = await Role.findOne({ where: { id } });
    if (!role) {
      return res.json(successWrong("角色不存在"));
    }
    let data = role.dataValues;
    if (permission_ids) {
      data.permission_ids = permission_ids;
    }
    data.updated_time = getCurrentTime();
    let roleupdated = await Role.update(data, { where: { id: id } });
    if (roleupdated) {
      return res.json(success("修改成功"));
    }
  } catch (e) {
    return res.json(fail(e));
  }
});

module.exports = router;
