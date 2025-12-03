const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

exports.signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });


    const hashed = await bcrypt.hash(password, 10);


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
    console.log(" Login attempt for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("   User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("   Password mismatch");
      return res.status(401).json({ message: "Incorrect password" });
    }


    const token = createToken({ id: user._id });
    console.log("   Login successful, token generated for user ID:", user._id);

    res.json({ message: "Login success", token });
  } catch (err) {
    console.error("   Login error:", err.message);
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
