import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({ path: '../Backend/config/config.env' });


export const dbConnection = async () => {
  try {
    // Check if MONGO_URI is not defined
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "HOSPITAL_MANAGEMENT_SYSTEM", // Ensure this matches your MongoDB database name
    });

    console.log("✅ Connected to the database successfully.");
  } catch (error) {
    console.error(`❌ Error connecting to the database: ${error.message}`);
    process.exit(1); // Exit process if DB connection fails
  }
};
