const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['wallet_transfer', 'bill_payment', 'recharge', 'utility', 'merchant_payment'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be at least 0.01']
  },
  recipient: {
    type: String,
    required: function() {
      return this.type === 'wallet_transfer';
    }
  },
  recipientName: {
    type: String
  },
  biller: {
    type: String,
    required: function() {
      return this.type === 'bill_payment' || this.type === 'utility';
    }
  },
  description: {
    type: String,
    maxlength: 200
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  failureReason: {
    type: String,
    maxlength: 200
  },
  metadata: {
    type: Map,
    of: String
  },
  processedAt: {
    type: Date
  }
}, {
  timestamps: true
});

transactionSchema.index({ userId: 1, createdAt: -1 });
// transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ status: 1 });

transactionSchema.methods.toJSON = function() {
  const transaction = this.toObject();
  transaction._id = transaction._id.toString();
  transaction.userId = transaction.userId.toString();
  return transaction;
};

module.exports = mongoose.model('Transaction', transactionSchema);