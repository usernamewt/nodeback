// 用户路由
let express = require('express')
let router = express.Router()
const User = require('../db/model/userModel');
let md5 = require('md5-node')
let vertoken = require('../token/index')
let {Op} = require('sequelize')
const {fail,success,successWithData,successWrong} =require('../utils/result');
const moment = require('moment');
const { getCurrentTime } = require('../utils/base');
// 可用账号user user123
/**
 * 用户登录
 */
router.post('/user/login', async(req, res) => {
    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;
    if(username ===""||password ===""){
        res.json(successWrong("用户名或密码不能为空"))
    }
    let user = await User.findOne({where:{username}});
    if(!user){
        return res.json(successWrong("用户不存在"))
    }
    if(user.state === 0){
        return res.json(successWrong("用户已被禁用"))
    }
    let md5Pass = md5(req.body.password+req.body.username);
    // md5校验
    if(md5Pass === user.password){
        // 密码正确，返回鉴权token
        let data = await vertoken.setToken(user.username,user.id);
        return res.json(successWithData(data))
    }else {
        return res.json(successWrong("密码错误"))
    }
})

/**
 * 新增用户
 */
router.post('/user/add', async(req, res) => {
    try {
        let {username,password,avatar,mobile,nickname,state,role_id} = req.body;
        let user = await User.findOne({where:{username}});
        if(user){
            return res.json(successWrong("用户名已存在"))
        }
        password = md5(password+username);
        let time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        await User.create({username,password,avatar,mobile,nickname,state,role_id,create_time:time,updated_time:time});
        return res.json(success("添加用户成功"));
    }
    catch (e) {
        console.log(e);
        return res.json(fail(e));
    }
})

// 分页查询用户
router.post("/user/getByPage",async (req,res)=>{
    const page = req.body.currentPage;
    const limit = req.body.pageSize;
    let offset = (page - 1) * limit;
    let where = {};
    if(req.body.username){
        where["username"] = {
            [Op.like]: `%${req.body.username}%`
        }
    }
    try {
        const resule = await User.findAndCountAll({
            where,
            offset,
            limit,
            order:[["created_time","desc"]]
        })
        return res.json(successWithData(resule))
    }
    catch (e) {
        console.log(e);
        return res.json(fail(e))
    }
})

// 绑定角色
router.post("/user/bindRole",async (req,res)=>{
    try{
        let {user_id,role_id} = req.body;
        user_id = user_id.split(",");
        let users = await User.findAll({where:{id:{[Op.in]:user_id}}});
        if(users.length === 0){
            return res.json(successWrong("用户不存在"))
        }
        for(let i = 0;i<users.length;i++){
            await User.update({role_id,updated_time:getCurrentTime()},{where:{id:users[i].id}})
        }
        return res.json(success("绑定角色成功"))
    }
    catch(e) {
        console.log(e);
        return res.json(fail(e))
    }
})
module.exports = router