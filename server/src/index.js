// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const summaryRoutes = require("./routes/summary");
const transactionsRoutes = require("./routes/transactions");
const connectDB = require("./db");

const app = express();

// Connect to MongoDB
connectDB();

// Allow multiple origins for CORS (development + production)
const allowedOrigins = [
  "http://localhost:5173",           // Local development
  "https://fin-bud-two.vercel.app",  // Production Vercel deployment
  "https://fin-5qf9k8dvt-lakshyabapnas-projects.vercel.app",
  process.env.FRONTEND_URL,          // Additional custom origin from .env
].filter(Boolean); // Remove undefined/null values

console.log("🌐 Allowed CORS origins:", allowedOrigins);

// CORS configuration with multiple origin support
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

// Global middleware
app.use(express.json());
app.use(cookieParser());

// Use CORS with the options
app.use(cors(corsOptions));

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).send("FinBud backend is running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/transactions", transactionsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
