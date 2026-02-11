const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const userController = require("../controller/user.controller");
router.post("/create", userController.createUser);
router.get("/me", authController.authenticate, userController.getUser);
module.exports = router;
