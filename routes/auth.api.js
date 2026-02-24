const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
router.post("/loginwithMail", authController.loginwithMail);
router.post("/google", authController.loginwithGoogle);
module.exports = router;
