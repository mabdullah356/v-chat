const express = require("express");
const { newChat, ChatWithUser } = require("../Controllers/chat.controller");
const isUserLogin = require("../Middlewares/isUserLogin");
const router = express.Router();
const upload = require("../Middlewares/multerStorage");

router.post("/",isUserLogin,upload.single("image"),newChat)
router.get("/:username", isUserLogin, ChatWithUser);

module.exports = router;
