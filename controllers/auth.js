const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const { createUser, findUserByEmail, findUserById } = require("../schemas/user");

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existed = await findUserByEmail(email);
  if (existed) {
    return next(createError(409, "Email already exists"));
  }

  const passwordHash = await hashPassword(password);
  const userId = await createUser({ name, email, passwordHash, role: role === "admin" ? "admin" : "user" });
  const user = await findUserById(userId);

  res.status(201).json({ success: true, data: user });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return next(createError(401, "Invalid credentials"));
  }

  const matched = await comparePassword(password, user.password_hash);
  if (!matched) {
    return next(createError(401, "Invalid credentials"));
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

const googleLogin = asyncHandler(async (req, res, next) => {
  const { idToken, accessToken } = req.body;
  if (!idToken && !accessToken) {
    return next(createError(400, "idToken or accessToken is required"));
  }

  let email, name;

  if (accessToken) {
    // Dùng access_token để lấy thông tin user từ Google
    const fetch = (await import("node-fetch")).default;
    const googleRes = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!googleRes.ok) {
      return next(createError(401, "Invalid Google access token"));
    }
    const profile = await googleRes.json();
    email = profile.email;
    name = profile.name;
  } else {
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      return next(createError(401, "Invalid Google ID token"));
    }
    const payload = ticket.getPayload();
    email = payload.email;
    name = payload.name;
  }

  if (!email) {
    return next(createError(400, "Google account does not have an email"));
  }

  let user = await findUserByEmail(email);

  if (!user) {
    const randomPassword = Math.random().toString(36).slice(-10) + Date.now().toString(36);
    const passwordHash = await hashPassword(randomPassword);
    const userId = await createUser({ name: name || "Google User", email, passwordHash, role: "user" });
    user = await findUserById(userId);
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

module.exports = {
  register,
  login,
  googleLogin,
};
