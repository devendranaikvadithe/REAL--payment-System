const express = require('express');
const router = express.Router();

const User = require('../models/User');
const { authenticate } = require('../middleware/auth');


// Add Bank Account
router.post('/add', authenticate, async (req, res) => {
  try {
    const {
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      accountType
    } = req.body;

    const user = await User.findById(req.user.id || req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.bankAccount = {
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      accountType,
      verified: false
    };

    await user.save();

    res.json({
      success: true,
      message: 'Bank account added successfully',
      data: user.bankAccount
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// Get Bank Account
router.get('/me', authenticate, async (req, res) => {
  try {

    const user = await User.findById(
      req.user.id || req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.bankAccount
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;