
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

exports.getMonthlySummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const { month, year } = req.query;

        const date = new Date();
        const targetMonth = month ? parseInt(month) - 1 : date.getMonth();
        const targetYear = year ? parseInt(year) : date.getFullYear();

        const start = new Date(targetYear, targetMonth, 1);
        const end = new Date(targetYear, targetMonth + 1, 1);

        const stats = await Transaction.aggregate([
            {
                $match: {
                    userId,
                    date: { $gte: start, $lt: end },
                },
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                },
            },
        ]);

        let income = 0;
        let expense = 0;

        stats.forEach((stat) => {
            if (stat._id === "INCOME") income = stat.total;
            if (stat._id === "EXPENSE") expense = stat.total;
        });

        res.json({
            income,
            expense,
            balance: income - expense,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

exports.getCategoryBreakdown = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const { month, year } = req.query;

        const date = new Date();
        const targetMonth = month ? parseInt(month) - 1 : date.getMonth();
        const targetYear = year ? parseInt(year) : date.getFullYear();

        const start = new Date(targetYear, targetMonth, 1);
        const end = new Date(targetYear, targetMonth + 1, 1);

        const categories = await Transaction.aggregate([
            {
                $match: {
                    userId,
                    type: "EXPENSE",
                    date: { $gte: start, $lt: end },
                },
            },
            {
                $group: {
                    _id: "$category",
                    amount: { $sum: "$amount" },
                },
            },
            {
                $project: {
                    name: "$_id",
                    amount: 1,
                    _id: 0,
                },
            },
        ]);

        res.json({ categories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

exports.getSpendingTrends = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const { month, year } = req.query;

        const date = new Date();
        let targetYear = year ? parseInt(year) : date.getFullYear();
        let targetMonth = month ? parseInt(month) - 1 : date.getMonth();

      
        const endWindow = new Date(targetYear, targetMonth + 1, 1);

        const startWindow = new Date(targetYear, targetMonth - 5, 1);

        const trends = await Transaction.aggregate([
            {
                $match: {
                    userId,
                    date: { $gte: startWindow, $lt: endWindow },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                        type: "$type",
                    },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const monthMap = new Map();

       
        for (let i = 0; i < 6; i++) {
            const d = new Date(startWindow.getFullYear(), startWindow.getMonth() + i, 1);
            const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
            monthMap.set(key, {
                month: d.toLocaleString("default", { month: "short" }),
                income: 0,
                expense: 0,
            });
        }

        trends.forEach((t) => {
            const key = `${t._id.year}-${t._id.month}`;
            if (monthMap.has(key)) {
                const entry = monthMap.get(key);
                if (t._id.type === "INCOME") entry.income = t.total;
                if (t._id.type === "EXPENSE") entry.expense = t.total;
            }
        });

        res.json({ trends: Array.from(monthMap.values()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

exports.getDailySummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const stats = await Transaction.aggregate([
            {
                $match: {
                    userId,
                    type: "EXPENSE",
                    date: { $gte: yesterday },
                },
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$date" },
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                    },
                    total: { $sum: "$amount" },
                },
            },
        ]);

        let todaySpend = 0;
        let yesterdaySpend = 0;

        stats.forEach((stat) => {
            const statDate = new Date(stat._id.year, stat._id.month - 1, stat._id.day);
            if (statDate.getTime() === today.getTime()) {
                todaySpend = stat.total;
            } else if (statDate.getTime() === yesterday.getTime()) {
                yesterdaySpend = stat.total;
            }
        });

        res.json({ today: todaySpend, yesterday: yesterdaySpend });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};
