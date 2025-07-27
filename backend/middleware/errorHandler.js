const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong'
  };

  // Supabase specific errors
  if (err.code) {
    switch (err.code) {
      case 'PGRST116':
        error = {
          success: false,
          error: 'Not Found',
          message: 'Resource not found'
        };
        return res.status(404).json(error);
      case 'PGRST204':
        error = {
          success: false,
          error: 'Bad Request',
          message: 'Invalid request data'
        };
        return res.status(400).json(error);
      default:
        error.message = err.message || 'Database error';
        return res.status(500).json(error);
    }
  }

  // Custom application errors
  if (err.statusCode) {
    error = {
      success: false,
      error: err.name || 'Application Error',
      message: err.message
    };
    return res.status(err.statusCode).json(error);
  }

  // Default server error
  res.status(500).json(error);
};

module.exports = errorHandler;