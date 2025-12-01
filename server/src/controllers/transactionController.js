// src/controllers/transactionController.js
const Transaction = require("../models/Transaction");

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = async (req, res) => {
    try {
        const { title, amount, type, category, date } = req.body;

        const transaction = await Transaction.create({
            userId: req.user.id,
            title,
            amount,
            type,
            category,
            date: date || Date.now(),
        });

        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({
            date: -1,
        });

        res.json({ transactions });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        // Ensure user owns transaction
        if (transaction.userId.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        await transaction.deleteOne();

        res.json({ message: "Transaction removed" });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        // Ensure user owns transaction
        if (transaction.userId.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};
