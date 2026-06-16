const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: { type: String },

  password: {
    type: String,
    required: true,
    select: false
  },

  walletBalance: {
    type: Number,
    default: 1000
  },

  // ================= EMAIL VERIFICATION =================
  isEmailVerified: {
    type: Boolean,
    default: false
  },

  emailOTP: String,
  emailOTPExpiry: Date,

  // ================= BANK ACCOUNT =================
  bankAccount: {
    bankName: String,

    accountHolderName: String,

    accountNumber: String,

    ifscCode: String,

    accountType: {
      type: String,
      enum: ['Savings', 'Current'],
      default: 'Savings'
    },

    upiId: String,

verified: {
  type: Boolean,
  default: false
}
  },

  // ================= KYC =================
  kyc: {
  aadhaarNumber: String,

  panNumber: String,

  panVerified: {
    type: Boolean,
    default: false
  },

  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}

}, { timestamps: true });


// Hash Password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});


// Compare Password
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);