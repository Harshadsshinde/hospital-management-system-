// Import required modules and middlewares
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"; // Middleware to catch asynchronous errors and pass them to the error handler
import { User } from "../models/userSchema.js"; // Mongoose model for user data (Patients, Doctors, Admins)
import ErrorHandler from "../middlewares/error.js"; // Custom error handler for sending consistent error responses
import { generateToken } from "../utils/jwtToken.js"; // Utility function to generate JWT tokens for authentication
import cloudinary from "cloudinary"; // Cloudinary SDK for handling image uploads

/**
 * Patient Registration
 * Registers a new patient by validating required fields, checking for existing registration,
 * creating a new patient record, and generating a JWT token.
 */
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  // Destructure patient registration details from the request body
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
  
  // Validate that all required fields are provided
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Check if a user with the provided email is already registered
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  // Create a new patient record with role "Patient"
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });

  // Generate a JWT token and send response
  generateToken(user, "User Registered!", 200, res);
});

/**
 * User Login
 * Authenticates a user by validating email, password, confirmPassword, and role.
 * Checks if the user exists and if the provided password matches.
 * Generates a JWT token upon successful authentication.
 */
export const login = catchAsyncErrors(async (req, res, next) => {
  // Destructure login credentials from the request body
  const { email, password, confirmPassword, role } = req.body;
  
  // Validate that all required fields are provided
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  
  // Ensure the password and confirmPassword match
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password & Confirm Password Do Not Match!", 400));
  }
  
  // Find the user by email and include the password field for verification
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  
  // Compare the provided password with the stored password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  
  // Check if the provided role matches the user's role
  if (role !== user.role) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }
  
  // Generate a JWT token and send response upon successful login
  generateToken(user, "Login Successfully!", 201, res);
});

/**
 * Add New Admin
 * Registers a new admin by validating required fields, ensuring uniqueness of email,
 * creating a new admin record, sending a response, and generating a token.
 */
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  // Destructure admin registration details from the request body
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
  
  // Validate that all required fields are provided
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  
  // Check if an admin with the provided email already exists
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }
  
  // Create a new admin record with role "Admin"
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  
  // Send a success response with admin details
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
  
  // Generate a JWT token for the admin (Note: 'user' is not defined here; should be 'admin')
  generateToken(admin, "Login Successfully!", 201, res);
});

/**
 * Add New Doctor
 * Registers a new doctor by validating required fields and file upload for the avatar,
 * uploading the avatar image to Cloudinary, and creating a new doctor record.
 */
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  // Validate that a file has been uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  
  // Extract the doctor avatar from the uploaded files
  const { docAvatar } = req.files;
  
  // Define allowed image formats for the avatar
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  
  // Destructure doctor registration details from the request body
  const { firstName, lastName, email, phone, nic, dob, gender, password, doctorDepartment } = req.body;
  
  // Validate that all required fields (including doctor avatar) are provided
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  
  // Check if a doctor with the provided email already exists
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Doctor With This Email Already Exists!", 400));
  }
  
  // Upload the doctor avatar image to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500));
  }
  
  // Create a new doctor record with role "Doctor" and include Cloudinary avatar details
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  
  // Send a success response with the new doctor details
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

/**
 * Get All Doctors
 * Retrieves all users with the role "Doctor" from the database.
 */
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

/**
 * Get User Details
 * Returns the details of the currently authenticated user.
 */
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user; // The user is assumed to be attached to req by authentication middleware
  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * Logout Admin
 * Logs out the admin by clearing the "adminToken" cookie.
 */
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()), // Immediately expire the cookie
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

/**
 * Logout Patient
 * Logs out the patient by clearing the "patientToken" cookie.
 */
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()), // Immediately expire the cookie
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});
