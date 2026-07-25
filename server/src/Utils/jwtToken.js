const jwt = require("jsonwebtoken");
const User = require("../Models/user.model");

const generateToken = (res,user) => {
  const payload = {
    id: user.id,
  };

  const jwtSecret = process.env.JWT_SECRET;
  const jwtExp = process.env.JWT_EXP;

  const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExp });

  const options = {
    maxAge: 24 * 60 * 60 * 1000
  };

  res.cookie("token", token, options);
  return token;
};

module.exports = generateToken;