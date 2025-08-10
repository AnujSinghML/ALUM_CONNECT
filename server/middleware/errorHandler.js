// server/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error('Global Error Handler:', {
      message: err.message,
      stack: err.stack,
      status: err.statusCode || 500
    });
    
    // Handle specific connection errors
    if (err.code === 'ECONNRESET' || err.message.includes('ECONNRESET')) {
      console.error('Connection reset error detected. This might be due to:');
      console.error('- Network connectivity issues');
      console.error('- Server overload');
      console.error('- Firewall/proxy interference');
      console.error('- Database connection problems');
      
      return res.status(503).json({
        success: false,
        error: 'Service temporarily unavailable due to connection issues. Please try again.',
        retryAfter: 30
      });
    }
    
    // Handle MongoDB connection errors
    if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError') {
      console.error('MongoDB connection error:', err.message);
      return res.status(503).json({
        success: false,
        error: 'Database connection error. Please try again.',
        retryAfter: 10
      });
    }
    
    // Default error response
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  };
  