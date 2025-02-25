import express from "express"; // Import Express framework for creating the server and routes
import { dbConnection } from "./database/dbConnection.js"; // Import the function to connect to the database
import { config } from "dotenv"; // Import dotenv to load environment variables from a .env file
import cookieParser from "cookie-parser"; // Import cookie-parser to parse cookies attached to client requests
import cors from "cors"; // Import CORS middleware to handle Cross-Origin Resource Sharing
import fileUpload from "express-fileupload"; // Import fileUpload middleware for handling file uploads
import { errorMiddleware } from "./middlewares/error.js"; // Import custom error middleware for handling errors
import messageRouter from "./router/messageRouter.js"; // Import the router for message-related routes
import userRouter from "./router/userRouter.js"; // Import the router for user-related routes
import appointmentRouter from "./router/appointmentRouter.js"; // Import the router for appointment-related routes

const app = express(); // Create an instance of an Express application

// Load environment variables from the config.env file
config({ path: "./config.env" });

// Enable CORS for specified origins, methods, and credentials (cookies, authentication headers, etc.)
app.use(
  cors({
    // Allow requests from these frontend URLs (environment variables or hardcoded)
    origin: [process.env.FRONTEND_URL_ONE, process.env.FRONTEND_URL_TWO, 'http://localhost:5173'],
    method: ["GET", "POST", "DELETE", "PUT"], // Allowed HTTP methods
    credentials: true, // Allow cookies and other credentials in requests
  })
);

app.use(cookieParser()); // Parse incoming request cookies and populate req.cookies
app.use(express.json()); // Parse incoming JSON payloads and populate req.body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

// Enable file uploads using temporary files stored in the /tmp/ directory
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Define routes for the application by mounting the respective routers
app.use("/api/v1/message", messageRouter); // Routes for messages (e.g., send and get messages)
app.use("/api/v1/user", userRouter); // Routes for user operations (e.g., registration, login)
app.use("/api/v1/appointment", appointmentRouter); // Routes for appointment operations (e.g., creating, updating appointments)

// Establish the database connection
dbConnection();

// Use the custom error middleware to handle errors after all routes have been defined
app.use(errorMiddleware);

// Export the Express app instance for use in the server startup file
export default app;
