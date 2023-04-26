const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const passwordResetController = require("../controllers/passwordResetController");

const router = express.Router();

// POST /signup - Allows a user to sign up by providing their name, email address, device token, and password
router.post(
  "/signup",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Invalid email address"),
    check("device_token").notEmpty().withMessage("Device token is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  authController.signup
);

// POST /login - Allows a user to log in by providing their email address and password
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Invalid email address"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

// POST /forgot-password - Allows a user to request a password reset by providing their email address
router.post(
  "/forgot-password",
  [check("email").isEmail().withMessage("Invalid email address")],
  passwordResetController.forgotPassword
);

// POST /reset-password - Allows a user to reset their password by providing a new password and a otp generated after requesting a password reset
router.post(
  "/reset-password",
  [
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    check("otp").notEmpty().withMessage("OTP is required"),
  ],
  passwordResetController.resetPassword
);

// GET /logout - Allow user to logout
router.get("/logout", authController.logout);

// GET /logout-all-devices - Allow user to logout of all the devices.
router.get("/logout-all-devices", authController.logoutAllDevices);

module.exports = router;
