import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import CategoryDonut from "../components/CategoryDonut"; // you created earlier
import RecentTransactions from "../components/RecentTransactions";
import TransactionModal from "../components/TransactionModal";
import "./dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expense: 0,
    savings: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // load user + stats
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchMeAndStats() {
      try {
        setLoading(true);
        const [meRes, statsRes] = await Promise.all([
          fetch("http://localhost:5001/api/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5001/api/summary/monthly", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (meRes.ok) {
          const meJson = await meRes.json();
          setUser(meJson.user || null);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (statsRes.ok) {
          const s = await statsRes.json();
          // expected shape: { balance, income, expense, savings }
          setStats({
            balance: s.balance ?? 0,
            income: s.income ?? 0,
            expense: s.expense ?? 0,
            savings: s.savings ?? 0
          });
        } else {
          // if stats endpoint missing, keep defaults
          console.warn("Monthly stats fetch failed");
        }
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMeAndStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const onTransactionAdded = (newTx) => {
    // refresh stats & transactions - simple approach: refetch stats
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:5001/api/summary/monthly", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((s) => {
        if (s) setStats({
          balance: s.balance ?? stats.balance,
          income: s.income ?? stats.income,
          expense: s.expense ?? stats.expense,
          savings: s.savings ?? stats.savings
        });
      })
      .catch((e) => console.warn(e));
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>FinBud Dashboard</h2>
          {user && <span className="small-muted">Welcome, {user.name}</span>}
        </div>

        <div className="dashboard-actions">
          <button className="ghost-btn" onClick={handleLogout}>Logout</button>
          <button className="primary-btn" onClick={() => setShowModal(true)}>Add Transaction</button>
        </div>
      </div>

      <div className="stats-row">
        <StatsCard label="Balance" value={stats.balance} prefix="₹" />
        <StatsCard label="Income (month)" value={stats.income} prefix="₹" />
        <StatsCard label="Expense (month)" value={stats.expense} prefix="₹" />
        <StatsCard label="Savings" value={stats.savings} prefix="₹" />
      </div>

      <div className="main-grid">
        <div className="chart-card">
          <CategoryDonut />
        </div>

        <div className="transactions-card">
          <RecentTransactions onTxAdded={onTransactionAdded} />
        </div>
      </div>

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onAdded={(tx) => { setShowModal(false); onTransactionAdded(tx); }}
        />
      )}

      {loading && <div className="loading-overlay">Loading...</div>}
    </div>
  );
}
