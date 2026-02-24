const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const authController = {};
require("dotenv").config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
authController.loginwithMail = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("존재하지 않는 유저입니다.");
    }
    if (user) {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (isMatch) {
        const token = await user.generateToken();

        return res
          .status(200)
          .json({ status: "로그인 성공", user: user, accessToken: token });
      }
    }
    throw new Error("아이디 혹은 비밀번호가 일치하지 않습니다.");
  } catch (error) {
    res.status(400).json({ status: "로그인 실패", error: error.message });
  }
};
authController.loginwithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = "" + Math.floor(Math.random() * 1000000);
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(randomPassword, salt);

      user = new User({
        email,
        name,
        password: hashedPassword,
        level: "customer",
      });
      await user.save();
    }
    const userToken = await user.generateToken();

    return res
      .status(200)
      .json({ status: "로그인 성공", user: user, token: userToken });
  } catch (error) {
    res.status(400).json({ status: "로그인 실패", error: error.message });
  }
};
authController.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", ""); // Bearer <token>
    if (!token) {
      throw new Error("인증 실패");
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
      if (error) {
        return res
          .status(401)
          .json({ status: "인증 실패", error: error.message });
      }
      req.userId = payload._id;
    });
    next();
  } catch {
    res.status(401).json({ status: "인증 실패", error: "인증 실패" });
  }
};

authController.checkAdminPermission = async (req, res, next) => {
  // 1. user의 level이 admin인지 확인
  // 2. 맞으면 next()
  // 3. 아니면 403 에러
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (user?.level !== "admin") {
      throw new Error("관리자 권한이 없습니다.");
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(403)
      .json({ status: "관리자 권한이 없습니다.", error: error.message });
  }
};

module.exports = authController;
