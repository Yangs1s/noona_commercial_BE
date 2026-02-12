const User = require("../model/User");
const bcrypt = require("bcryptjs");

const userController = {};

// 유저가 존재하는지
// 암호화
userController.createUser = async (req, res) => {
  try {
    let { email, password, name, address, phone, level } = req.body;
    // user의 존재유무
    // user는 이메일로 찾는다.
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("이미 존재하는 유저가 있습니다.");
    }

    // 비밀번호는 암호화 한다.

    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      password,
      name,
      address,
      phone,
      level: level ? level : "customer",
    });

    await newUser.save();
    return res.status(200).json({ status: "회원가입을 성공했습니다." });
  } catch (error) {
    res.status(400).json({ status: "회원가입 실패", error: error.message });
  }
};

userController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("유저를 찾을 수 없습니다.");
    }
    return res.status(200).json({ status: "유저 조회 성공", user });
  } catch (error) {
    res.status(400).json({ status: "유저 조회 실패", error: error.message });
  }
};

module.exports = userController;
