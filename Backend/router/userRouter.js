import express from "express"; // Import Express framework for routing
import {
  addNewAdmin,     // Controller function to register a new admin
  addNewDoctor,    // Controller function to register a new doctor
  getAllDoctors,   // Controller function to fetch all doctors
  getUserDetails,  // Controller function to fetch details of the logged-in user
  login,           // Controller function to log in a user (admin or patient)
  logoutAdmin,     // Controller function to log out an admin
  logoutPatient,   // Controller function to log out a patient
  patientRegister, // Controller function to register a new patient
} from "../controller/userController.js";
import {
  isAdminAuthenticated,  // Middleware to check if the admin is authenticated
  isPatientAuthenticated, // Middleware to check if the patient is authenticated
} from "../middlewares/auth.js";

const router = express.Router(); // Create a new Express router instance

// Route to register a new patient (public route)
router.post("/patient/register", patientRegister);

// Route to log in a user (can be admin or patient based on credentials)
router.post("/login", login);

// Route to add a new admin (protected: only accessible by an authenticated admin)
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

// Route to add a new doctor (protected: only accessible by an authenticated admin)
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

// Route to get all doctors (protected: only accessible by an authenticated admin)
router.get("/doctors", isAdminAuthenticated, getAllDoctors);

// Route to get details of the currently logged-in patient (protected: only accessible by an authenticated patient)
router.get("/patient/me", isPatientAuthenticated, getUserDetails);

// Route to get details of the currently logged-in admin (protected: only accessible by an authenticated admin)
router.get("/admin/me", isAdminAuthenticated, getUserDetails);

// Route to log out a patient (protected: only accessible by an authenticated patient)
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);

// Route to log out an admin (protected: only accessible by an authenticated admin)
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

export default router; // Export the router to be used in the main application
