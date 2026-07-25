const express  = require("express");
const { newChat } = require("../Controllers/chat.controller");
const isUserLogin = require("../Middlewares/isUserLogin");
const router = express.Router();


router.post("/",isUserLogin,newChat);

module.exports = router;
