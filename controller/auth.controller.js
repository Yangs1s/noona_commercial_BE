const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authController = {};
require("dotenv").config();

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
        console.log("token", token);
        return res
          .status(200)
          .json({ status: "로그인 성공", user: user, token: token });
      }
    }
    throw new Error("아이디 혹은 비밀번호가 일치하지 않습니다.");
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
    next();
  } catch (error) {
    res
      .status(403)
      .json({ status: "관리자 권한이 없습니다.", error: error.message });
  }
};
module.exports = authController;
