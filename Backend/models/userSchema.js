import mongoose from "mongoose"; // Import Mongoose for creating schemas and models
import validator from "validator"; // Import validator for validating strings (e.g., email)
import bcrypt from "bcrypt"; // Import bcrypt for hashing passwords
import jwt from "jsonwebtoken"; // Import JSON Web Token library for token generation

// Define the schema for a User
const userSchema = new mongoose.Schema({
  // User's first name, required with a minimum length of 3 characters
  firstName: {
    type: String,
    required: [true, "First Name Is Required!"],
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  // User's last name, required with a minimum length of 3 characters
  lastName: {
    type: String,
    required: [true, "Last Name Is Required!"],
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  // User's email, required and validated for proper email format
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  // User's phone number, required with exact length of 10 characters (as specified by minLength and maxLength)
  phone: {
    type: String,
    required: [true, "Phone Is Required!"],
    minLength: [10, "Phone Number Must Contain Exact 11 Digits!"],
    maxLength: [10, "Phone Number Must Contain Exact 11 Digits!"],
  },
  // User's NIC (National Identity Card number), required with specified min and max lengths
  nic: {
    type: String,
    required: [true, "NIC Is Required!"],
    minLength: [2, "NIC Must Contain Only 13 Digits!"],
    maxLength: [13, "NIC Must Contain Only 13 Digits!"],
  },
  // User's Date of Birth, required
  dob: {
    type: Date,
    required: [true, "DOB Is Required!"],
  },
  // User's gender, required and must be either "Male" or "Female"
  gender: {
    type: String,
    required: [true, "Gender Is Required!"],
    enum: ["Male", "Female"],
  },
  // User's password, required with a minimum length of 8 characters, and not selected by default in queries
  password: {
    type: String,
    required: [true, "Password Is Required!"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    select: false, // Exclude the password field from query results by default
  },
  // User role, required and must be one of "Patient", "Doctor", or "Admin"
  role: {
    type: String,
    required: [true, "User Role Required!"],
    enum: ["Patient", "Doctor", "Admin"],
  },
  // Doctor's department (only applicable if the user is a doctor)
  doctorDepartment: {
    type: String,
  },
  // Doctor's avatar details (only applicable if the user is a doctor)
  docAvatar: {
    public_id: String,
    url: String,
  },
});

// Pre-save middleware to hash the password before saving a User document
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified("password")) {
    next();
  }
  // Hash the password with a salt round of 10
  this.password = await bcrypt.hash(this.password, 10);
});

// Instance method to compare a provided password with the hashed password in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to generate a JSON Web Token for the user
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Create and export the User model based on the userSchema
export const User = mongoose.model("User", userSchema);
