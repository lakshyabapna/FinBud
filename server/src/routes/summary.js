// src/routes/summary.js
const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/category", verifyToken, (req, res) => {
  res.json({
    categories: [
      { name: "Food", amount: 1000 },
      { name: "Transport", amount: 500 },
    ],
  });
});

router.get("/monthly", verifyToken, (req, res) => {
  res.json({
    months: [
      { month: "Jan", total: 4000 },
      { month: "Feb", total: 3500 },
    ],
  });
});

module.exports = router;
