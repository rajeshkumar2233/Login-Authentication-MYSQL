const express = require('express');
const { check } = require('express-validator');
const passwordResetController = require('../controllers/passwordResetController');

const router = express.Router();

// POST /forgot-password - Allows a user to request a password reset by providing their email address
router.post('/forgot-password', [
  check('email').isEmail().withMessage('Invalid email address')
], passwordResetController.forgotPassword);

// POST /reset-password - Allows a user to reset their password by providing a new password and a otp generated after requesting a password reset
router.post('/reset-password', [
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('otp').notEmpty().withMessage('OTP is required')
], passwordResetController.resetPassword);

module.exports = router;
