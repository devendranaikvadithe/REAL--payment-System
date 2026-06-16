const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action'
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };

// const jwt = require('jsonwebtoken');
// const config = require('../../config/config');

// const authenticate = (req, res, next) => {

//   console.log("========== AUTH ==========");
//   console.log("AUTH HEADER:", req.headers.authorization);

//   try {

//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {

//       console.log("NO TOKEN RECEIVED");

//       return res.status(401).json({
//         success: false,
//         message: 'No token provided, authorization denied'
//       });
//     }

//     const token = authHeader.split(' ')[1];

//     console.log("TOKEN:", token);

//     const decoded = jwt.verify(
//       token,
//       config.jwt.secret
//     );

//     console.log("DECODED:", decoded);

//     req.user = decoded;

//     next();

//   } catch (error) {

//     console.log("JWT ERROR:", error.message);

//     return res.status(401).json({
//       success: false,
//       message: 'Token is invalid or expired'
//     });
//   }
// };

// module.exports = { authenticate };