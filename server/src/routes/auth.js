const express = require("express");
const { signupUser, loginUser, getUser } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", (req, res) => {
  console.log("📩 Signup route hit with body:", req.body);
  signupUser(req, res);
});

router.post("/login", (req, res) => {
  console.log("🔑 Login route hit with body:", req.body);
  loginUser(req, res);
});

router.get("/me", (req, res) => {
  console.log("👤 /me route hit with token:", req.headers.authorization);
  getUser(req, res);
});

module.exports = router;
