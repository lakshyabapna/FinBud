
const express = require("express");
const router = express.Router();

const {
  signupUser,
  loginUser,
  getUser,
} = require("../controllers/authController");

const verifyToken = require("../middleware/verifyToken");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getUser);

module.exports = router;

