const express = require('express');
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { generateTransactionId } = require('../utils/transactionId');
const logger = require('../utils/logger');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Initiate payment
router.post('/initiate', authenticate, [
 body('type').isIn([
'wallet_transfer',
'bill_payment',
'recharge',
'utility',
'merchant_payment'
])
    .withMessage('Invalid payment type'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
  body('recipient').optional().notEmpty().withMessage('Recipient is required for transfers'),
  body('biller').optional().notEmpty().withMessage('Biller is required for bill payments'),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('Description too long')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { type, amount, recipient, recipientName, biller, description, metadata } = req.body;
    const userId = req.user.id;
    // console.log("REQ.USER =", req.user);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    const transactionId = generateTransactionId();

    const transaction = await Transaction.create({
      transactionId,
      userId,
      type,
      amount,
      recipient,
      recipientName,
      biller,
      description,
      metadata,
      status: 'pending'
    });

    logger.info('Payment initiated', { 
      transactionId, 
      userId, 
      type, 
      amount 
    });

    res.status(201).json({
      success: true,
      message: 'Payment initiated successfully',
      data: { transaction: transaction.toJSON() }
    });
  } catch (error) {
    next(error);
  }
});

// Process payment (simulate async processing)
router.post('/:transactionId/process', authenticate, async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({ 
      transactionId, 
      userId 
    }).populate('userId', 'walletBalance');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Transaction already ${transaction.status}`
      });
    }

    transaction.status = 'processing';
    await transaction.save();

    setTimeout(async () => {
      try {
        const user = await User.findById(userId);
        
        if (user.walletBalance < transaction.amount) {
          transaction.status = 'failed';
          transaction.failureReason = 'Insufficient balance at processing time';
          await transaction.save();
          return;
        }

        user.walletBalance -= transaction.amount;
        await user.save();

        transaction.status = 'completed';
        transaction.processedAt = new Date();
        await transaction.save();

        logger.info('Payment completed', { 
          transactionId: transaction.transactionId,
          userId,
          amount: transaction.amount
        });
      } catch (error) {
        logger.error('Payment processing failed', { transactionId, error: error.message });
        transaction.status = 'failed';
        transaction.failureReason = 'Processing error';
        await transaction.save();
      }
    }, 2000);

    res.json({
      success: true,
      message: 'Payment processing started',
      data: { transaction: transaction.toJSON() }
    });
  } catch (error) {
    next(error);
  }
});

// Get transaction status
router.get('/:transactionId/status', authenticate, async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({ 
      transactionId, 
      userId 
    }).select('-__v');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: { transaction: transaction.toJSON() }
    });
  } catch (error) {
    next(error);
  }
});

// Get all transactions
router.get('/transactions', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, type } = req.query;

    const query = { userId };
    
    if (status) query.status = status;
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-__v');

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single transaction
router.get('/transactions/:transactionId', authenticate, async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({ 
      transactionId, 
      userId 
    }).select('-__v');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: { transaction: transaction.toJSON() }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;