const { validationResult } = require('express-validator');
const moment = require('moment')
function checkParam(req){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let msg = ""
        let arr = []
        errors.array().forEach(errror=>{
            arr.push(errror.param+":"+errror.msg)
        })
        msg = arr.join(",")
        throw new Error("BadRequestError#"+msg)
    }
}
// 递归函数，获取树形结构
function getTree(fid, arr, res) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].fid == fid) {
            arr[i].key = arr[i].id
            res.push(arr[i])
            //res.push({index: arr[i].path,title:arr[i].name,icon:arr[i].icon,fid:arr[i].fid})
            arr.splice(i, 1)
            i--
        }
    }
    res.map(r => {
        r.children = []
        getTree(r.id, arr, r.children)
        if (r.children.length == 0) {
            delete r.children
        }
    })
    return res
}

 //函数返回ip地址
 function getClientIp(req) {
     return req.headers['x-forwarded-for'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.connection.socket.remoteAddress;
 }

 function getCurrentTime(){
    return moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
 }
module.exports = {
    checkParam,
    getTree,
    getClientIp,
    getCurrentTime
}