import mongoose from "mongoose";
import { Mongoose } from "mongoose"; // (Optional import; ensure it's needed or remove if unused)
import validator from "validator";

// Define the appointment schema using Mongoose
const appointmentSchema = new mongoose.Schema({
  // Patient's first name with required validation and minimum length
  firstName: {
    type: String,
    required: [true, "First Name Is Required!"],
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  // Patient's last name with required validation and minimum length
  lastName: {
    type: String,
    required: [true, "Last Name Is Required!"],
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  // Patient's email with required validation and email format check using validator
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  // Patient's phone number with required validation and fixed length (exact 11 digits as per error message, but min/max defined as 10)
  phone: {
    type: String,
    required: [true, "Phone Is Required!"],
    minLength: [10, "Phone Number Must Contain Exact 11 Digits!"],
    maxLength: [10, "Phone Number Must Contain Exact 11 Digits!"],
  },
  // Patient's NIC with required validation and fixed length (expected to be 13 digits)
  nic: {
    type: String,
    required: [true, "NIC Is Required!"],
    minLength: [2, "NIC Must Contain Only 13 Digits!"],
    maxLength: [13, "NIC Must Contain Only 13 Digits!"],
  },
  // Date of Birth of the patient with required validation
  dob: {
    type: Date,
    required: [true, "DOB Is Required!"],
  },
  // Gender field with required validation and enum constraint
  gender: {
    type: String,
    required: [true, "Gender Is Required!"],
    enum: ["Male", "Female"],
  },
  // Appointment date as a string with required validation (can be modified to Date type if needed)
  appointment_date: {
    type: String,
    required: [true, "Appointment Date Is Required!"],
  },
  // Department for the appointment with required validation
  department: {
    type: String,
    required: [true, "Department Name Is Required!"],
  },
  // Doctor details as a nested object with required first and last name
  doctor: {
    firstName: {
      type: String,
      required: [true, "Doctor Name Is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Doctor Name Is Required!"],
    },
  },
  // Flag to indicate if the patient has visited before, defaulting to false
  hasVisited: {
    type: Boolean,
    default: false,
  },
  // Patient's address with required validation
  address: {
    type: String,
    required: [true, "Address Is Required!"],
  },
  // Reference to the doctor's ID (as a Mongoose ObjectId) with required validation
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Doctor Id Is Invalid!"],
  },
  // Reference to the patient's ID (as a Mongoose ObjectId) with a reference to the "User" model and required validation
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Patient Id Is Required!"],
  },
  // Status of the appointment with enum values and a default value of "Pending"
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

// Create and export the Appointment model using the appointmentSchema
export const Appointment = mongoose.model("Appointment", appointmentSchema);
