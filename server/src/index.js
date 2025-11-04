const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const authRoutes = require("./routes/auth");
const cors = require("cors");

dotenv.config(); 
const app = express(); 
const prisma = new PrismaClient();

app.use(cors()); 
app.use(express.json());

app.get("/", (req, res) => {
  console.log("🌍 Root route hit!");
  res.status(200).send("FinBud backend is running!");
});


app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});




