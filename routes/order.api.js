const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller");
const authController = require("../controller/auth.controller");
router.post(
  "/create",
  authController.authenticate,
  orderController.createOrder,
);

module.exports = router;
