const express  = require("express");
const { Signup, Login } = require("../Controllers/user.controller");
const router = express.Router();


router.post("/register",Signup);
router.post("/login",Login)

module.exports = router;
