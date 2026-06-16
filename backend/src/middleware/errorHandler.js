const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    path: req.path,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;