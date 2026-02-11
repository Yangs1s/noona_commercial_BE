const express = require("express");
const router = express.Router();
const userRouter = require("./user.api");
const authRouter = require("./auth.api");

router.use("/user", userRouter);
router.use("/auth", authRouter);
module.exports = router;
