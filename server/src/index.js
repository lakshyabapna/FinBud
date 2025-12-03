
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const summaryRoutes = require("./routes/summary");
const transactionsRoutes = require("./routes/transactions");
const connectDB = require("./db");

const app = express();


connectDB();


const allowedOrigins = [
  "http://localhost:5173",           
  "https://fin-bud-two.vercel.app", 
  "https://fin-5qf9k8dvt-lakshyabapnas-projects.vercel.app",
  process.env.FRONTEND_URL,          
].filter(Boolean); 

console.log("🌐 Allowed CORS origins:", allowedOrigins);


const corsOptions = {
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(" CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};


app.use(express.json());
app.use(cookieParser());


app.use(cors(corsOptions));


app.get("/", (req, res) => {
  res.status(200).send("FinBud backend is running!");
});


app.use("/api/auth", authRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/transactions", transactionsRoutes);


app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
