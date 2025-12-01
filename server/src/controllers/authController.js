// const { PrismaClient } = require("@prisma/client");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const prisma = new PrismaClient();

// const signupUser = async (req, res) => {
//     console.log(" Signup route hit");
//     console.log("Body:", req.body);
//   const { name, email, password } = req.body;
//   try {
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await prisma.user.create({
//       data: { name, email, password: hashedPassword },
//     });

//     res.status(201).json({ message: "User created successfully", user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error signing up", error: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ message: "Login successful", token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error logging in", error: error.message });
//   }
// };
// const getUser = async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ error: "No token provided" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       select: { id: true, name: true, email: true },
//     });

//     if (!user) return res.status(404).json({ error: "User not found" });

//     res.json({ user });
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ error: "Invalid or expired token" });
//   }
// };

// module.exports = { signupUser, loginUser, getUser };
// src/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

exports.signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashed,
    });

    await user.save();

    res.status(201).json({ message: "User created", user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔑 Login attempt for:", email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("  ❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("  ❌ Password mismatch");
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate token
    const token = createToken({ id: user._id });
    console.log("  ✅ Login successful, token generated for user ID:", user._id);

    res.json({ message: "Login success", token });
  } catch (err) {
    console.error("  ❌ Login error:", err.message);
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
