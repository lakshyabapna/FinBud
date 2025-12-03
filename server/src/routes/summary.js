
const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
    getMonthlySummary,
    getCategoryBreakdown,
    getSpendingTrends,
    getDailySummary,
} = require("../controllers/summaryController");

const router = express.Router();

router.get("/monthly", verifyToken, getMonthlySummary);
router.get("/category", verifyToken, getCategoryBreakdown);
router.get("/trends", verifyToken, getSpendingTrends);
router.get("/daily", verifyToken, getDailySummary);

module.exports = router;
