import mongoose from "mongoose"; // Import Mongoose for schema and model creation
import validator from "validator"; // Import validator to validate email format

// Define the schema for a Message
const messageSchema = new mongoose.Schema({
  // First name of the sender
  firstName: {
    type: String, // Data type is String
    require: true, // Field is required (note: typically "required" is used instead of "require")
    minLength: [3, "first name must contain at least three character !"], // Minimum length validation with custom message
  },
  // Last name of the sender
  lastName: {
    type: String, // Data type is String
    require: true, // Field is required
    minLength: [3, "first name must contain at least three character !"], // Minimum length validation with custom message
  },
  // Email of the sender
  email: {
    type: String, // Data type is String
    require: true, // Field is required
    // Validate the email using validator.isEmail function with a custom message if invalid
    validator: [validator.isEmail, "Please provide a valid email "],
  },
  // Phone number of the sender
  phone: {
    type: String, // Data type is String
    require: true, // Field is required
    minLength: [10, "phone number must contain 10 character !"], // Minimum length validation with custom message
  },
  // Message content
  message: {
    type: String, // Data type is String
    require: true, // Field is required
    minLength: [10, "message must contain at least ten character !"], // Minimum length validation with custom message
  },
});

// Create and export the Message model based on the messageSchema.
// The model name is "message" (collection will be pluralized by Mongoose, e.g., "messages")
export const Message = mongoose.model("message", messageSchema);
