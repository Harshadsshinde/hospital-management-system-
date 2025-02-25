// Import required modules and models
import { User } from "../models/userSchema.js"; // Mongoose model for user data (includes Patients, Admins, etc.)
import { catchAsyncErrors } from "./catchAsyncErrors.js"; // Middleware to catch asynchronous errors and pass them to the error handler
import ErrorHandler from "./error.js"; // Custom error handler for sending consistent error responses
import jwt from "jsonwebtoken"; // Library for creating and verifying JSON Web Tokens

// Middleware to authenticate dashboard users (Admins)
export const isAdminAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    // Retrieve the token from the cookies using the key "adminToken"
    const token = req.cookies.adminToken;
    
    // If no token is found, the admin is not authenticated
    if (!token) {
      return next(
        new ErrorHandler("Dashboard User is not authenticated!", 400)
      );
    }
    
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Retrieve the user from the database using the id from the decoded token
    req.user = await User.findById(decoded.id);
    
    // Check if the retrieved user has the role "Admin"
    if (req.user.role !== "Admin") {
      return next(
        new ErrorHandler(
          `${req.user.role} not authorized for this resource!`, 403
        )
      );
    }
    
    // Proceed to the next middleware or route handler if authenticated and authorized
    next();
  }
);

// Middleware to authenticate frontend users (Patients)
export const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    // Retrieve the token from the cookies using the key "patientToken"
    const token = req.cookies.patientToken;
    
    // If no token is found, the user is not authenticated
    if (!token) {
      return next(new ErrorHandler("User is not authenticated!", 400));
    }
    
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Retrieve the user from the database using the id from the decoded token
    req.user = await User.findById(decoded.id);
    
    // Check if the retrieved user has the role "Patient"
    if (req.user.role !== "Patient") {
      return next(
        new ErrorHandler(
          `${req.user.role} not authorized for this resource!`, 403
        )
      );
    }
    
    // Proceed to the next middleware or route handler if authenticated and authorized
    next();
  }
);

// Middleware to authorize users based on provided roles
// Usage: isAuthorized("Admin", "Patient") will allow only users with these roles
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    // Check if the role of the authenticated user (attached to req.user) is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource!`
        )
      );
    }
    // Proceed if the user's role is authorized
    next();
  };
};
