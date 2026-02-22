const express = require("express");
const router = express.Router();
const userRouter = require("./user.api");
const authRouter = require("./auth.api");
const productRouter = require("./product.api");
const cartRouter = require("./cart.api");
const orderRouter = require("./order.api");

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
module.exports = router;
