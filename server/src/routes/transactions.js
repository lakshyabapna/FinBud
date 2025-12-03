
const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
} = require("../controllers/transactionController");

const router = express.Router();

router.post("/", verifyToken, addTransaction);
router.get("/", verifyToken, getTransactions);
router.put("/:id", verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);

module.exports = router;
