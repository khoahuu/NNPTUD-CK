const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change_me_please";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  signToken,
  verifyToken,
};
