// 用户路由
let express = require("express");
let router = express.Router();
let axios = require("axios");
const User = require("../db/model/userModel");
const Role = require("../db/model/roleModel");
const Permission = require("../db/model/permissionModel");
let md5 = require("md5-node");
let wxconfig = require("../enum/wx");
let vertoken = require("../token/index");
const { getTree } = require("../utils/base");
let { Op } = require("sequelize");
const {
  fail,
  success,
  successWithData,
  successWrong,
} = require("../utils/result");
const moment = require("moment");
const { getCurrentTime } = require("../utils/base");
const ChatInfo = require("../db/model/chatInfo");

let blacklist = {}; //token失效黑名单
// 可用账号user user123
/**
 * 用户登录
 */
router.post("/user/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username === "" || password === "") {
    res.json(successWrong("用户名或密码不能为空"));
  }
  let user = await User.findOne({ where: { username } });
  if (!user) {
    return res.json(successWrong("用户不存在"));
  }
  if (user.state === 0) {
    return res.json(successWrong("用户已被禁用"));
  }
  let md5Pass = md5(req.body.password + req.body.username);
  // md5校验
  if (md5Pass === user.password) {
    // 密码正确，返回鉴权token
    let data = await vertoken.setToken(user.username, user.id);
    return res.json(successWithData(data));
  } else {
    if(username === 'user'){
      return res.json(successWrong("user账号已不对外开发，请联系管理员"));
    }else {
      return res.json(successWrong("密码错误"));
    }
  }
});

// 微信小程序用户登录
router.post("/user/wxlogin", async (req, res) => {
  const { code } = req.body;
  const appid = wxconfig.appid;
  const secretid = wxconfig.secretid;
  const { data } = await axios.get(
    `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secretid}&js_code=${code}`
  );
  const token = await vertoken.setToken(data.openid, data.session_key);
  if (data) {
    return res.json(successWithData(token));
  } else {
    return res.json(successWrong("登录失败"));
  }
  // TODO:
  // 1. 根据openid查询数据库，判断用户是否存在
});

// 微信小程序注册
router.post("/user/wxregister", async (req, res) => {
  const { phone } = req.body;
});

/**
 * 退出登录
 */
router.get("/user/logout", async (req, res) => {
  try {
    let data = req.headers.authorization;
    let verify = await vertoken.getToken(data);
    vertoken.removeToken(verify.username, verify.id);
    return res.json(success("退出登录成功"));
  } catch (e) {
    return res.json(fail(e));
  }
});

/**
 * 新增用户
 */
router.post("/user/add", async (req, res) => {
  try {
    let {
      username,
      password,
      avatar,
      mobile,
      nickname,
      state,
      role_id,
      bgavatar,
    } = req.body;
    let user = await User.findOne({ where: { username } });
    if (user) {
      return res.json(successWrong("用户名已存在"));
    }
    password = md5(password + username);
    let time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    role_id = role_id.toString();
    await User.create({
      username,
      password,
      avatar,
      mobile,
      nickname,
      state,
      role_id,
      bgavatar,
      create_time: time,
      updated_time: time,
    });
    return res.json(success("添加用户成功"));
  } catch (e) {
    return res.json(fail(e));
  }
});
/**
 * 删除用户
 */
router.post("/user/delete", async (req, res) => {
  try {
    let { id } = req.body;
    let user = await User.findOne({ where: { id } });
    if (!user) {
      return res.json(successWrong("用户不存在"));
    }
    await User.destroy({ where: { id } });
    return res.json(success("删除用户成功"));
  } catch (e) {
    return res.json(fail(e));
  }
});
/**
 * 修改用户
 */
router.post("/user/update", async (req, res) => {
  try {
    let { id, mobile, nickname, state, role_id, bgavatar } = req.body;
    let user = await User.findOne({ where: { id } });
    if (!user) {
      return res.json(successWrong("用户不存在"));
    }
    let updated_time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    console.log(mobile, nickname, state, role_id, updated_time, bgavatar);
    role_id = role_id.toString();
    let userUpdate = {
      mobile,
      nickname,
      state,
      role_id,
      updated_time,
      bgavatar,
    };
    await User.update(userUpdate, { where: { id } });
    return res.json(success("修改用户成功"));
  } catch (e) {
    return res.json(fail(e));
  }
});

/**
 * 修改用户状态
 */
router.post("/user/updateState", async (req, res) => {
  try {
    let { id, state } = req.body;
    let user = await User.findOne({ where: { id } });
    if (!user) {
      return res.json(successWrong("用户不存在"));
    }
    let updated_time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    await User.update({ state, updated_time }, { where: { id } });
    return res.json(success("修改用户状态成功"));
  } catch (e) {
    return res.json(fail(e));
  }
});
/**
 * 修改用户头像
 */
router.post("/user/updateAvatar", async (req, res) => {
  try {
    let { id, avatar } = req.body;
    let user = await User.findOne({ where: { id } });
    if (!user) {
      return res.json(successWrong("用户不存在"));
    }
    let updated_time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    let userUpdate = { avatar, updated_time };
    await User.update(userUpdate, { where: { id } });
    return res.json(success("修改用户头像成功"));
  } catch (e) {
    return res.json(fail(e));
  }
});
/**
 * 修改密码
 */
router.post("/user/updatePassword", async (req, res) => {
  try {
    let { id, password } = req.body;
    let user = await User.findOne({ where: { id } });
    if (!user) {
      return res.json(successWrong("用户不存在"));
    }
    password = md5(password + user.username);
    await User.update({ password }, { where: { id } });
    return res.json(success("修改密码成功"));
  } catch (e) {
    return res.json(fail(e));
  }
});

// 分页查询用户
router.post("/user/getByPage", async (req, res) => {
  const page = req.body.currentPage;
  const limit = req.body.pageSize;
  console.log(req.body);

  let offset = (page - 1) * limit;
  let where = {};
  if (req.body.nickname) {
    where["nickname"] = {
      [Op.like]: `%${req.body.nickname}%`,
    };
  }
  if (req.body.username) {
    where["username"] = {
      [Op.like]: `%${req.body.username}%`,
    };
  }
  if (req.body.mobile) {
    where["mobile"] = {
      [Op.like]: `%${req.body.mobile}%`,
    };
  }
  if (req.body.state != undefined) {
    where["state"] = { [Op.eq]: req.body.state };
  }
  if (req.body.created_time) {
    const targetDay = new Date(req.body.created_time);
    const startOfDay = new Date(targetDay.setHours(0, 0, 0, 0)); // 当天开始时间
    const endOfDay = new Date(targetDay.setHours(23, 59, 59, 999)); // 当天结束时间
    where["created_time"] = {
      [Op.gte]: startOfDay, // 大于等于当天开始时间
      [Op.lt]: endOfDay,
    };
  }
  try {
    const resule = await User.findAndCountAll({
      where,
      offset,
      limit,
      order: [["id", "asc"]],
    });
    resule.rows = resule.rows.map((item) => {
      return {
        avatar: item.avatar,
        bgavatar: item.bgavatar,
        created_time: item.created_time,
        id: item.id,
        mobile: item.mobile,
        nickname: item.nickname,
        role_id: item.role_id.split(","),
        state: item.state,
        updated_time: item.updated_time,
        username: item.username,
      };
    });
    return res.json(successWithData(resule));
  } catch (e) {
    return res.json(fail(e));
  }
});

// 绑定角色
router.post("/user/bindRole", async (req, res) => {
  try {
    let { user_id, role_id } = req.body;
    user_id = user_id.split(",");
    let users = await User.findAll({ where: { id: { [Op.in]: user_id } } });
    if (users.length === 0) {
      return res.json(successWrong("用户不存在"));
    }
    for (let i = 0; i < users.length; i++) {
      await User.update(
        { role_id, updated_time: getCurrentTime() },
        { where: { id: users[i].id } }
      );
    }
    return res.json(success("绑定角色成功"));
  } catch (e) {
    console.log(e);
    return res.json(fail(e));
  }
});
// 获取用户的鉴权和菜单权限
router.get("/user/getAuth", async (req, res) => {
  try {
    let token = req.headers.authorization;
    let tokenUser = await vertoken.getToken(token);
    // let {user_id} = req.body;
    let user = await User.findOne({
      where: { id: tokenUser.id },
      attributes: [
        "id",
        "username",
        "avatar",
        "mobile",
        "nickname",
        "state",
        "role_id",
        "bgavatar",
      ],
    });
    if (!user) {
      return res.json(successWrong("用户不存在"));
    }
    // 获取多个角色
    let role = await Role.findAll({
      where: {
        id: {
          [Op.in]: user.role_id.split(","),
        },
        state: { [Op.eq]: 1 },
      },
      attributes: ["id", "permission_ids"],
    });
    if (!role) {
      return res.json(successWrong("角色不存在"));
    }
    // 获取多角色
    let permission_ids = "";
    role.forEach((item) => {
      console.log(item.dataValues.permission_ids);
      permission_ids += item.dataValues.permission_ids + ",";
    });
    permission_ids = permission_ids.split(",");
    let permissions = await Permission.findAll({
      where: { id: { [Op.in]: permission_ids } },
    });
    permissions = permissions.map((item) => {
      return item.dataValues;
    });
    if (!permissions) {
      return res.json(successWrong("权限不存在"));
    }
    // 组装鉴权
    let data = [];
    let formData = permissions.map((o) => {
      return {
        id: o.id,
        title: o.title,
        fid: o.fid,
        component: o.component,
        level: o.level,
        checkIcon: o.icondef,
        ckeckedIcon: o.iconact,
        perms: o.perms,
        mark: o.mark,
        level: o.level,
        isFrame: o.isFrame,
        path: o.path,
        is_hidden: o.is_hidden,
        state: o.state,
        sort: o.sort,
      };
    });
    getTree(0, formData, data);
    return res.json(successWithData({ user, role, permissions: data }));
  } catch (e) {
    return res.json(fail(e));
  }
});

// 获取用户聊天列表
router.get("/user/getChatList", async (req, res) => {
  let token = req.headers.authorization;
  let tokenUser = await vertoken.getToken(token);
  try {
    const userId = parseInt(tokenUser.id);
    const query = `
       SELECT 
         u.id AS partner_id,
        u.username AS partner_name,
        u.avatar AS partner_avatar,
        u.bgavatar AS partner_bgavatar,
        u.nickname AS partner_nickname,
        latest_chat.content AS last_message,
        latest_chat.created_time AS last_message_time
      FROM user u
      LEFT JOIN (
        SELECT 
          CASE 
            WHEN c1.from_id = ${userId} THEN c1.to_id
            ELSE c1.from_id
          END AS partner_id,
          c1.content,
          c1.created_time
        FROM chat_info c1
        JOIN (
          SELECT 
            CASE 
              WHEN from_id = ${userId} THEN to_id
              ELSE from_id
            END AS partner,
            MAX(created_time) AS max_time
          FROM chat_info
          WHERE from_id = ${userId} OR to_id = ${userId}
          GROUP BY partner
        ) c2 ON (c1.from_id = ${userId} OR c1.to_id = ${userId})
          AND c1.created_time = c2.max_time
      ) latest_chat ON u.id = latest_chat.partner_id
      WHERE u.id != ${userId}
      ORDER BY 
        CASE 
          WHEN last_message_time IS NULL THEN 1
          ELSE 0
        END,
        last_message_time DESC;
    `;
    const results = await ChatInfo.sequelize.query(query, {
      replacements: { userId },
      type: ChatInfo.sequelize.QueryTypes.SELECT,
      raw: true,
    });

    res.json(successWithData(results));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = { router, blacklist };
