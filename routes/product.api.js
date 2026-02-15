const express = require("express");
const router = express.Router();

const productController = require("../controller/product.controller");
const authController = require("../controller/auth.controller");

router.post(
  "/create",
  authController.authenticate,
  authController.checkAdminPermission,
  productController.createProduct,
);
router.get(
  "/",
  authController.authenticate,
  authController.checkAdminPermission,
  productController.getProducts,
);

module.exports = router;
