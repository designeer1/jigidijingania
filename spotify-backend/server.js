import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import connectCloudinary from "./src/config/cloudinary.js";
import connectDB from "./src/config/mongodb.js";
import songRouter from "./src/routes/songRoute.js";
import albumRouter from "./src/routes/albumRoute.js";

// Load environment variables
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Fix for form-data issues
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE" }));

// Multer setup for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Connect to services
(async () => {
  try {
    await connectCloudinary();
    console.log("✅ Cloudinary Connected");
    await connectDB();
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Error connecting to services:", error);
    process.exit(1); // Exit if connection fails
  }
})();

// Initialize Routers
app.use("/api/song", songRouter);
app.use("/api/album", albumRouter);

app.get("/", (req, res) => res.send("✅ API is working"));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});

// Start Server
const server = app.listen(port, () => console.log(`🚀 Server started on http://localhost:${port}`));

// Handle process termination
process.on("SIGINT", () => {
  console.log("❌ Server shutting down...");
  server.close(() => {
    console.log("✅ Server closed.");
    process.exit(0);
  });
});
