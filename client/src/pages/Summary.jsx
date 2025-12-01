import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./summary.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function Summary() {
    const navigate = useNavigate();
    const [monthlyStats, setMonthlyStats] = useState({ income: 0, expense: 0, balance: 0 });
    const [trends, setTrends] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const reportRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
                const headers = { Authorization: `Bearer ${token}` };

                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();

                const [statsRes, catRes, trendsRes] = await Promise.all([
                    fetch(`${API_BASE}/api/summary/monthly?month=${month}&year=${year}`, { headers }),
                    fetch(`${API_BASE}/api/summary/category?month=${month}&year=${year}`, { headers }),
                    fetch(`${API_BASE}/api/summary/trends?month=${month}&year=${year}`, { headers })
                ]);

                if (statsRes.ok) {
                    setMonthlyStats(await statsRes.json());
                }

                if (catRes.ok) {
                    const cats = await catRes.json();
                    setCategoryData(cats.categories || []);
                }

                if (trendsRes.ok) {
                    const tr = await trendsRes.json();
                    setTrends(tr.trends || []);
                }

            } catch (err) {
                console.error("Error fetching summary data:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [navigate, currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const exportPDF = async () => {
        const element = reportRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`FinBud_Report_${currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}.pdf`);
    };

    if (loading) return <div className="loading-container">Loading report...</div>;

    const savingsRate = monthlyStats.income > 0
        ? ((monthlyStats.balance / monthlyStats.income) * 100).toFixed(1)
        : 0;

    const topCategory = categoryData.length > 0
        ? categoryData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current)
        : null;

    return (
        <div className="summary-container" ref={reportRef}>
            {/* Header */}
            <header className="report-header">
                <div>
                    <h1>Monthly Financial Report</h1>
                    <p className="report-date">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="report-actions">
                    <button className="secondary-btn" onClick={handlePrevMonth}>&lt; Prev</button>
                    <button className="secondary-btn" onClick={handleNextMonth}>Next &gt;</button>
                    <button className="secondary-btn primary" onClick={exportPDF}>Export PDF</button>
                </div>
            </header>

            {/* Key Metrics Row */}
            <div className="metrics-row">
                <div className="metric-card">
                    <div className="metric-label">Total Income</div>
                    <div className="metric-value income">₹{monthlyStats.income.toLocaleString()}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Total Expenses</div>
                    <div className="metric-value expense">₹{monthlyStats.expense.toLocaleString()}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Net Savings</div>
                    <div className="metric-value balance">₹{monthlyStats.balance.toLocaleString()}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Savings Rate</div>
                    <div className="metric-value rate">{savingsRate}%</div>
                </div>
            </div>

            {/* Main Chart: Income vs Expense */}
            <div className="report-section">
                <h2>Income vs Expense Trend</h2>
                <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={trends}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => `₹${value.toLocaleString()}`}
                            />
                            <Legend />
                            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Breakdown Grid */}
            <div className="breakdown-grid">
                {/* Category Donut */}
                <div className="report-section">
                    <h2>Expense Breakdown</h2>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="amount"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Insights Panel */}
                <div className="report-section insights-panel">
                    <h2>Insights</h2>
                    <div className="insight-item">
                        <span className="insight-icon">💡</span>
                        <div>
                            <strong>Top Spending Category</strong>
                            {topCategory ? (
                                <p>You spent <strong>₹{topCategory.amount.toLocaleString()}</strong> on {topCategory.name} this month.</p>
                            ) : (
                                <p>No expenses recorded this month.</p>
                            )}
                        </div>
                    </div>
                    <div className="insight-item">
                        <span className="insight-icon">📈</span>
                        <div>
                            <strong>Savings Goal</strong>
                            <p>You saved <strong>{savingsRate}%</strong> of your income. {savingsRate > 20 ? "Great job!" : "Try to aim for 20%."}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
