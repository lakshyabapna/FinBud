import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "../hooks/useToast";
import TransactionModal from "../components/TransactionModal";
import ConfirmDialog from "../components/ConfirmDialog";
import "./transactions.css";

export default function Transactions() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editTransaction, setEditTransaction] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const { confirmState, showConfirm } = useConfirm();


    const [filterCategory, setFilterCategory] = useState("All");
    const [filterType, setFilterType] = useState("All");

    useEffect(() => {
        fetchTransactions();
    }, [refreshKey]);

    async function fetchTransactions() {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/transactions`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const json = await res.json();
                setTransactions(json.transactions || []);
            }
        } catch (err) {
            console.error("Error fetching transactions:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        const confirmed = await showConfirm("Are you sure you want to delete this transaction?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");
            await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/transactions/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setRefreshKey((prev) => prev + 1);
        } catch (err) {
            console.error("Error deleting transaction:", err);
        }
    };


    const PREDEFINED_CATEGORIES = [
        "Food & Dining",
        "Transportation",
        "Shopping",
        "Utilities",
        "Health & Fitness",
        "Entertainment",
        "Other"
    ];

    const filteredTransactions = transactions.filter(t => {
    
        if (filterCategory !== "All") {
            if (filterCategory === "Other") {
            
                const isCustomCategory = !PREDEFINED_CATEGORIES.includes(t.category);
                if (!isCustomCategory && t.category !== "Other") return false;
            } else {
          
                if (t.category !== filterCategory) return false;
            }
        }


        if (filterType !== "All" && t.type !== filterType) return false;

        return true;
    });

    const totalIncome = filteredTransactions
        .filter(t => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
        .filter(t => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="transactions-container">
            <div className="tx-header-section">
                <div>
                    <h1>Transactions</h1>
                    <p className="tx-subtitle">Manage your income and expenses</p>
                </div>
                <button className="primary-btn" onClick={() => setShowModal(true)}>
                    + Add New
                </button>
            </div>


            <div className="tx-stats-row">
                <div className="tx-stat-card income">
                    <span className="tx-stat-label">Total Income</span>
                    <span className="tx-stat-value">₹{totalIncome.toLocaleString()}</span>
                </div>
                <div className="tx-stat-card expense">
                    <span className="tx-stat-label">Total Expenses</span>
                    <span className="tx-stat-value">₹{totalExpense.toLocaleString()}</span>
                </div>
                <div className="tx-stat-card balance">
                    <span className="tx-stat-label">Net Balance</span>
                    <span className="tx-stat-value">₹{(totalIncome - totalExpense).toLocaleString()}</span>
                </div>
            </div>


            <div className="tx-content-card">
                <div className="tx-filters">
                    <div className="filter-group">
                        <label>Category</label>
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                            <option value="All">All Categories</option>
                            <option value="Food & Dining">Food & Dining</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Health & Fitness">Health & Fitness</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Type</label>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                            <option value="All">All Types</option>
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                    </div>

                    <button className="reset-btn" onClick={() => { setFilterCategory("All"); setFilterType("All"); }}>
                        Reset
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="tx-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Details</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((t) => (
                                <tr key={t._id}>
                                    <td className="date-cell">
                                        <div className="date-day">{new Date(t.date).getDate()}</div>
                                        <div className="date-month">{new Date(t.date).toLocaleString('default', { month: 'short' })}</div>
                                    </td>
                                    <td>
                                        <div className="tx-title">{t.title}</div>
                                        <div className="tx-type-badge">{t.type}</div>
                                    </td>
                                    <td>
                                        <span className="category-pill">{t.category}</span>
                                    </td>
                                    <td className={`amount-cell ${t.type === "INCOME" ? "positive" : "negative"}`}>
                                        {t.type === "INCOME" ? "+" : "-"}₹{t.amount.toLocaleString()}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-icon edit"
                                                onClick={() => { setEditTransaction(t); setShowModal(true); }}
                                                title="Edit"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button className="action-icon delete" onClick={() => handleDelete(t._id)} title="Delete">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="empty-state">No transactions found matching your filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <TransactionModal
                    onClose={() => { setShowModal(false); setEditTransaction(null); }}
                    onAdded={() => { setShowModal(false); setEditTransaction(null); setRefreshKey(prev => prev + 1); }}
                    editTransaction={editTransaction}
                />
            )}
            {confirmState && (
                <ConfirmDialog
                    message={confirmState.message}
                    onConfirm={confirmState.onConfirm}
                    onCancel={confirmState.onCancel}
                />
            )}
        </div>
    );
}
