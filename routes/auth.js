const express = require("express");
const { register, login, googleLogin } = require("../controllers/auth");
const { updateMyProfile } = require("../controllers/user");
const { requireAuth } = require("../utils/auth");
const validate = require("../utils/validate");
const { registerValidator, loginValidator, updateProfileValidator } = require("../validators/auth");

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/google", googleLogin);
router.patch("/profile", requireAuth, updateProfileValidator, validate, updateMyProfile);

module.exports = router;
