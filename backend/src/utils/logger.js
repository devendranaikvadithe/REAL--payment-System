const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = JSON.stringify({
    timestamp,
    level,
    message,
    ...data
  }) + '\n';

  const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, logEntry);

  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${timestamp}] [${level}] ${message}`, data);
  }
};

const logger = {
  info: (msg, data) => log('INFO', msg, data),
  warn: (msg, data) => log('WARN', msg, data),
  error: (msg, data) => log('ERROR', msg, data),
  debug: (msg, data) => log('DEBUG', msg, data)
};

module.exports = logger;