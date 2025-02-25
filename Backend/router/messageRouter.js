import express from "express"; // Import Express framework
import {
  getAllMessages, // Controller function to retrieve all messages
  sendMessage,    // Controller function to send a new message
} from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js"; // Middleware to authenticate admin users

const router = express.Router(); // Create a new Express router instance

// Route to send a new message
// Accessible by anyone (no authentication middleware applied)
router.post("/send", sendMessage);

// Route to get all messages
// Protected route: only accessible by authenticated admin users
router.get("/getall", isAdminAuthenticated, getAllMessages);

export default router; // Export the router as the default export
