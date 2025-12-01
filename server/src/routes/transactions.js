// src/routes/transactions.js
const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  res.json({
    transactions: [
      { id: 1, category: "Food", amount: 200 },
      { id: 2, category: "Shopping", amount: 800 },
    ],
  });
});

module.exports = router;
