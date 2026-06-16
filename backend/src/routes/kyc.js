const express = require('express');
const router = express.Router();

const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// Submit KYC
router.post('/submit', authenticate, async (req, res) => {
  try {
    const {
      aadhaarNumber,
      panNumber
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.kyc = {
      aadhaarNumber,
      panNumber,
      panVerified: true,
      kycStatus: 'verified'
    };

    await user.save();

    res.json({
      success: true,
      message: 'KYC submitted successfully',
      kyc: user.kyc
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Get KYC Status
router.get('/status', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      kyc: user.kyc
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;