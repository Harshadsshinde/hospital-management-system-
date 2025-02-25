// Import required modules and middlewares
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"; // Middleware to handle async errors
import ErrorHandler from "../middlewares/error.js"; // Custom error handler for returning consistent error responses
import { Message } from "../models/messageSchema.js"; // Mongoose model for handling messages

/**
 * POST /api/v1/message/send
 * 
 * Sends a new message.
 * - Validates required fields.
 * - Saves the message to the database.
 * - Sends a success response.
 */
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  // Destructure message data from the request body
  const { firstName, lastName, email, phone, message } = req.body;

  // Check if all required fields are filled
  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please Fill Full Form!", 400)); // Send error if any field is missing
  }

  // Create a new message document in the database
  await Message.create({ firstName, lastName, email, phone, message });

  // Return a success response
  res.status(200).json({
    success: true,
    message: "Message Sent!",
  });
});

/**
 * GET /api/v1/message/getall
 * 
 * Retrieves all messages from the database.
 */
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  // Fetch all messages from the database
  const messages = await Message.find();

  // Return the list of messages in the response
  res.status(200).json({
    success: true,
    messages,
  });
});

// Export sendMessage function as the default export
export default sendMessage;
