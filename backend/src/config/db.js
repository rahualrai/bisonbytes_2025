import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/health_monitoring";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;