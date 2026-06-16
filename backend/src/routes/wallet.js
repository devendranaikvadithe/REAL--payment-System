const express = require('express');
const router = express.Router();

const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

router.post('/add-money', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findById(
      req.user.id || req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.bankAccount?.accountNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please link bank account first'
      });
    }

    user.walletBalance += Number(amount);

    await user.save();

    res.json({
      success: true,
      message: 'Money added successfully',
      walletBalance: user.walletBalance
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;