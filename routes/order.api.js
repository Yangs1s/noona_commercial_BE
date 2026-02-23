const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller");
const authController = require("../controller/auth.controller");
router.post(
  "/create",
  authController.authenticate,
  orderController.createOrder,
);
router.get("/", authController.authenticate, orderController.getOrder);
router.get(
  "/admin",
  authController.authenticate,
  authController.checkAdminPermission,
  orderController.getAdminOrder,
);

router.patch(
  "/status/:id",
  authController.authenticate,
  authController.checkAdminPermission,
  orderController.changeOrderStatus,
);
module.exports = router;
