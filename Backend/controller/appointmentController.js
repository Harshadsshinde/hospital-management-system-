// Import required modules and middlewares
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"; // Middleware to catch async errors
import ErrorHandler from "../middlewares/error.js"; // Custom error handler for sending consistent error responses
import { Appointment } from "../models/appointmentSchema.js"; // Mongoose model for appointments
import { User } from "../models/userSchema.js"; // Mongoose model for users (e.g., doctors, patients)

/**
 * POST /api/v1/appointment/post
 * 
 * Creates a new appointment.
 * - Validates that all required fields are provided.
 * - Checks for the existence and uniqueness of the doctor based on the provided name and department.
 * - Creates a new appointment document and returns it in the response.
 */
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  // Destructure the appointment data from the request body
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  // Validate that all required fields are present
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    // If any field is missing, pass an error to the error handler middleware
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Search for the doctor in the database matching the provided name, role, and department
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  // If no doctor is found, return a 404 error
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  // If more than one doctor is found, return a conflict error
  if (isConflict.length > 1) {
    return next(
      new ErrorHandler("Doctors Conflict! Please Contact Through Email Or Phone!", 400)
    );
  }

  // Extract the doctor's ID from the query result
  const doctorId = isConflict[0]._id;
  // Retrieve the patient ID from the authenticated request (assumed to be attached to req.user)
  const patientId = req.user._id;

  // Create a new appointment document in the database
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });

  // Return a success response with the appointment details
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Sent!",
  });
});

/**
 * GET /api/v1/appointment/getall
 * 
 * Retrieves all appointments from the database.
 */
export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  // Fetch all appointments from the database
  const appointments = await Appointment.find();
  // Return the appointments in the response
  res.status(200).json({
    success: true,
    appointments,
  });
});

/**
 * PUT /api/v1/appointment/update/:id
 * 
 * Updates the status or details of a specific appointment.
 */
export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
  // Extract the appointment ID from the URL parameters
  const { id } = req.params;
  // Find the appointment by its ID
  let appointment = await Appointment.findById(id);
  
  // If the appointment is not found, return a 404 error
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }
  
  // Update the appointment using the request body data
  appointment = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators on update
    useFindAndModify: false, // Use native findOneAndUpdate() instead of deprecated methods
  });
  
  // Return a success response indicating the update was successful
  res.status(200).json({
    success: true,
    message: "Appointment Status Updated!",
  });
});

/**
 * DELETE /api/v1/appointment/delete/:id
 * 
 * Deletes a specific appointment from the database.
 */
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  // Extract the appointment ID from the URL parameters
  const { id } = req.params;
  // Find the appointment by its ID
  const appointment = await Appointment.findById(id);
  
  // If the appointment is not found, return a 404 error
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  
  // Delete the appointment document from the database
  await appointment.deleteOne();
  
  // Return a success response indicating the deletion was successful
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
