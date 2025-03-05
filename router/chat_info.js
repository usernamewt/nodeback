const ChatInfo = require("../db/model/chatInfo");
const express = require("express");
const vertoken = require("../token/index");
const { successWithData, fail } = require("../utils/result");
const router = express.Router();
const {Op} = require("sequelize");

router.post("/chat/chatrecord", async (req, res) => {
  let token = req.headers.authorization;
  let tokenUser = await vertoken.getToken(token);
  let to_id = req.body.id;
  if (tokenUser) {
    let { id } = tokenUser;
    console.log(id,to_id);
    try {
      let chatList = await ChatInfo.findAll({

        where: { [Op.or]:[{from_id: id, to_id: to_id}, {from_id: to_id, to_id: id}] },
        order: [["created_time","ASC"]],
      });
      res.send(successWithData(chatList));
    } catch (err) {
      console.log(err);
      
      res.send(fail(err));
    }
  }
});

module.exports = router;
