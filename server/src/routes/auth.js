const express = require("express");
const { signupUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", (req, res) => {
  console.log("📩 Signup route hit with body:", req.body);
  signupUser(req, res);
});

router.post("/login", (req, res) => {
  console.log("🔑 Login route hit with body:", req.body);
  loginUser(req, res);
});

module.exports = router;




