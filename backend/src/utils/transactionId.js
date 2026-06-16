const { v4: uuidv4 } = require('uuid');

const generateTransactionId = () => {
  return `TXN${Date.now()}${uuidv4().slice(0, 8).toUpperCase()}`;
};

module.exports = { generateTransactionId };