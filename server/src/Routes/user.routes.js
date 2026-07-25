const express  = require("express");
const { Signup } = require("../Controllers/user.controller");
const router = express.Router();


router.post("/register",Signup);

module.exports = router;
