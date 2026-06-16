require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('../config/config');
const errorHandler = require('./middleware/errorHandler');
const apiLimiter = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const logger = require('./utils/logger');

const bankRoutes = require('./routes/bank');
const kycRoutes = require('./routes/kyc');

const walletRoutes = require('./routes/wallet');

const app = express();

/**
 * SECURITY MIDDLEWARE
 */
app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

/**
 * BODY PARSING
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * LOGGING
 */
if (config.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}

/**
 * RATE LIMITING (ONLY AUTH)
 */
app.use('/api/auth/login', apiLimiter);
app.use('/api/auth/register', apiLimiter);

/**
 * ROUTES
 */
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/wallet', walletRoutes);

/**
 * HEALTH CHECK
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Payment System API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

/**
 * 404 HANDLER
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/**
 * ERROR HANDLER
 */
app.use(errorHandler);

/**
 * DATABASE
 */
mongoose.connect(config.mongodb.uri)
  .then(() => {
    logger.info('MongoDB connected successfully');
  })
  .catch((error) => {
    logger.error('MongoDB connection error', { error: error.message });
    process.exit(1);
  });

/**
 * START SERVER
 */
const PORT = config.port;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
  });
}

module.exports = app;