const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// OTP generator
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();


// ================= SIGNUP =================
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const existingUser = await User.findOne({ email });

    // CASE 1: USER EXISTS
    if (existingUser) {

      // CASE 2: already verified
      if (existingUser.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered. Please login.'
        });
      }

      // CASE 3: exists but NOT verified → RESEND OTP
      existingUser.emailOTP = otp;
      existingUser.emailOTPExpiry = otpExpiry;
      existingUser.name = name || existingUser.name;
      existingUser.phone = phone || existingUser.phone;
      existingUser.password = password || existingUser.password;

      await existingUser.save();
       
      console.log("Sending OTP to:", email);
      await sendEmail(
        email,
        'Verify your email (Resend OTP)',
        `<h2>Your new OTP is: ${otp}</h2><p>Valid for 10 minutes</p>`
      );

      return res.json({
        success: true,
        message: 'OTP resent to your email'
      });
    }

    // CASE 4: NEW USER
    const newUser = await User.create({
      name,
      email,
      phone,
      password,
      emailOTP: otp,
      emailOTPExpiry: otpExpiry,
      isEmailVerified: false
    });
    console.log("Sending OTP to:", email);
    await sendEmail(
      email,
      'Verify your email',
      `<h2>Your OTP is: ${otp}</h2><p>Valid for 10 minutes</p>`
    );

    res.json({
      success: true,
      message: 'OTP sent to email'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= VERIFY OTP =================
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isEmailVerified) {
      return res.json({ message: 'Already verified' });
    }

    if (user.emailOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.emailOTPExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    user.isEmailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpiry = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN ATTEMPT:", email);

    const user = await User.findOne({ email }).select('+password');

    console.log("USER FOUND:", !!user);

    if (user) {
      console.log("EMAIL VERIFIED:", user.isEmailVerified);
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Please verify email first' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
  success: true,
  data: {
    token,
    user
  }
});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


    

// ================= GET ME =================
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    res.json({
      success: true,
      data: { user }
    });

  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;

// ================= DEBUG USERS =================
router.get('/debug-users', async (req, res) => {
  try {
    const users = await User.find({}, {
      email: 1,
      name: 1,
      isEmailVerified: 1
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;