import express from "express"; // Import Express framework
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
} from "../controller/appointmentController.js"; // Import appointment controller functions
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js"; // Import authentication middleware functions

const router = express.Router(); // Create a new Express router instance

// Route for patients to create a new appointment
// Only authenticated patients (verified via isPatientAuthenticated middleware) can access this route
router.post("/post", isPatientAuthenticated, postAppointment);

// Route for admins to retrieve all appointments
// Only authenticated admins (verified via isAdminAuthenticated middleware) can access this route
router.get("/getall", isAdminAuthenticated, getAllAppointments);

// Route for admins to update an appointment's status or details
// Only authenticated admins can access this route
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);

// Route for admins to delete an appointment by its ID
// Only authenticated admins can access this route
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

export default router; // Export the router as the default export
