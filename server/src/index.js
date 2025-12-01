// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const summaryRoutes = require("./routes/summary");
const transactionsRoutes = require("./routes/transactions");

const app = express();

// FRONTEND_URL must match your frontend origin EXACTLY (no trailing slash)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Proper CORS config for credentialed requests
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

// Global middleware
app.use(express.json());
app.use(cookieParser());

// Use CORS with the options. This automatically handles preflight for registered routes.
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
  console.log(`🌐 Allowed frontend origin: ${FRONTEND_URL}`);
});
