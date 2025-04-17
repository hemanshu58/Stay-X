const express = require("express");
const { test, signIn, signInAdmin, getCurrentUser, signOut, sendOTP, verifyOTP } = require("../controllers/auth.controller.js");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/test", test);
router.post("/signin", signIn);
router.post("/signin-admin", signInAdmin);
router.get("/currentuser", authenticate, getCurrentUser);
router.get("/signout", signOut);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;
