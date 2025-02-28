const Chat = require("../db/model/chatInfo");
const express = require("express");
const vertoken = require("../token/index");
const { successWithData, fail } = require("../utils/result");
const router = express.Router();

router.post("/chat/chatrecord", async (req, res) => {
  let token = req.headers.authorization;
  let tokenUser = await vertoken.getToken(token);
  let to_id = req.body.id;
  if (tokenUser) {
    let { id } = tokenUser;
    try {
      let chatList = await Chat.findAll({
        where: { from_id: id, to_id: to_id },
        order: {
          create_time: "desc",
        },
      });
      res.send(successWithData(chatList));
    } catch (err) {
      res.send(fail(err));
    }
  }
});

module.exports = router;
