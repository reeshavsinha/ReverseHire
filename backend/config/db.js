import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log("MONGODB_URI is not defined. Using in-memory DataStore.");
    isConnected = false;
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn("Falling back gracefully to in-memory DataStore.");
    return false;
  }
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}