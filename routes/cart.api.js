const express = require("express");
const router = express.Router();

const cartController = require("../controller/cart.controller");
const authController = require("../controller/auth.controller");

router.post("/create", authController.authenticate, cartController.createCart);
router.get("/get", authController.authenticate, cartController.getCart);
router.put("/update", authController.authenticate, cartController.updateCart);
router.delete(
  "/delete",
  authController.authenticate,
  cartController.deleteCart,
);
module.exports = router;
