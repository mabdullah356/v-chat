const express = require("express");
const { newChat, ChatWithUser } = require("../Controllers/chat.controller");
const isUserLogin = require("../Middlewares/isUserLogin");
const router = express.Router();

router.post("/",isUserLogin,newChat)
router.get("/:id", isUserLogin, ChatWithUser);

module.exports = router;
