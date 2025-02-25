// Extend the native Error class to create a custom error handler
class ErrorHandler extends Error {
  /**
   * Create a new ErrorHandler instance.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code.
   */
  constructor(message, statusCode) {
    super(message); // Call the parent Error class constructor with the message
    this.statusCode = statusCode; // Assign the HTTP status code to the error instance
  }
}

// Middleware to handle errors throughout the application
export const errorMiddleware = (err, req, res, next) => {
  // Set default message and statusCode if not provided
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    // Construct a message for the duplicate key error based on the field
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`,
      // Create a new ErrorHandler instance with the constructed message and a 400 status code
      err = new ErrorHandler(message, 400);
  }
  
  // Handle errors related to invalid JSON Web Tokens
  if (err.name === "JsonWebTokenError") {
    // Set a message indicating the JWT is invalid
    const message = `Json Web Token is invalid, Try again!`;
    // Create a new ErrorHandler instance with the message and a 400 status code
    err = new ErrorHandler(message, 400);
  }
  
  // Handle errors for expired JSON Web Tokens
  if (err.name === "TokenExpiredError") {
    // Set a message indicating the JWT has expired
    const message = `Json Web Token is expired, Try again!`;
    // Create a new ErrorHandler instance with the message and a 400 status code
    err = new ErrorHandler(message, 400);
  }
  
  // Handle CastError (e.g., invalid ObjectId format)
  if (err.name === "CastError") {
    // Construct a message using the invalid path from the error
    const message = `Invalid ${err.path}`,
      // Create a new ErrorHandler instance with the message and a 400 status code
      err = new ErrorHandler(message, 400);
  }

  // Construct a comprehensive error message
  // If there are validation errors (err.errors), combine their messages; otherwise use err.message
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  // Return a JSON response with the error status code and the error message
  return res.status(err.statusCode).json({
    success: false,
    // message: err.message, // original error message (commented out)
    message: errorMessage, // consolidated error message
  });
};

export default ErrorHandler;
