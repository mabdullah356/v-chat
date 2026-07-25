const express  = require("express");
const { Signup, Login, Logout } = require("../Controllers/user.controller");
const router = express.Router();


router.post("/register",Signup);
router.post("/login",Login);
router.post("/logout",Logout)

module.exports = router;
