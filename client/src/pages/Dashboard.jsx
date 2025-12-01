import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import TransactionModal from "../components/TransactionModal";
import "./dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [dailyStats, setDailyStats] = useState({ today: 0, yesterday: 0 });
  const [recentTx, setRecentTx] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
        const headers = { Authorization: `Bearer ${token}` };

        const [meRes, monthlyRes, dailyRes, txRes] = await Promise.all([
          fetch(`${API_BASE}/api/auth/me`, { headers }),
          fetch(`${API_BASE}/api/summary/monthly`, { headers }),
          fetch(`${API_BASE}/api/summary/daily`, { headers }),
          fetch(`${API_BASE}/api/transactions?limit=5`, { headers })
        ]);

        if (meRes.ok) {
          const meJson = await meRes.json();
          setUser(meJson.user);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (monthlyRes.ok) {
          const mJson = await monthlyRes.json();
          setBalance(mJson.balance || 0);
        }

        if (dailyRes.ok) {
          const dJson = await dailyRes.json();
          setDailyStats(dJson);
        }

        if (txRes.ok) {
          const tJson = await txRes.json();
          setRecentTx(tJson.transactions || []);
        }

      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate, refreshKey]);

  const onTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
  };


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", emoji: "☀️", message: "Ready to start your day smart?" };
    if (hour < 17) return { text: "Good afternoon", emoji: "👋", message: "Hope your day is going well!" };
    if (hour < 21) return { text: "Good evening", emoji: "🌆", message: "Time to review your finances!" };
    return { text: "Good night", emoji: "🌙", message: "Still working on your goals?" };
  };

  const pulseDiff = dailyStats.today - dailyStats.yesterday;
  const pulseSign = pulseDiff > 0 ? "+" : "";
  const greeting = getGreeting();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="greeting-section">
          <div className="greeting-main">
            <span className="greeting-emoji">{greeting.emoji}</span>
            <h1 className="greeting">{greeting.text}, {user?.name?.split(" ")[0] || "User"}!</h1>
          </div>
          <p className="greeting-subtext">{greeting.message}</p>
          <p className="date">{new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button className="fab-btn" onClick={() => setShowModal(true)}>
          + Add
        </button>
      </header>

      {/* Overview Cards */}
      <div className="overview-grid">
        {/* Wallet Card */}
        <div className="card wallet-card">
          <div className="card-label">Current Balance</div>
          <div className="wallet-amount">₹{balance.toLocaleString()}</div>
          <div className="wallet-footer">
            <span className="wallet-tag">Main Wallet</span>
          </div>
        </div>

        {/* Pulse Card */}
        <div className="card pulse-card">
          <div className="card-label">Today's Pulse</div>
          <div className="pulse-amount">₹{dailyStats.today.toLocaleString()}</div>
          <div className={`pulse-diff ${pulseDiff > 0 ? "negative" : "positive"}`}>
            {pulseSign}₹{Math.abs(pulseDiff).toLocaleString()} vs yesterday
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section-header">
        <h2>Recent Activity</h2>
        <Link to="/transactions" className="see-all">See All</Link>
      </div>

      <div className="recent-list">
        {recentTx.length === 0 ? (
          <div className="empty-state">No transactions yet.</div>
        ) : (
          recentTx.map((tx) => (
            <div key={tx._id} className="recent-item">
              <div className={`icon-box ${tx.type === "INCOME" ? "income" : "expense"}`}>
                {tx.type === "INCOME" ? "↓" : "↑"}
              </div>
              <div className="tx-info">
                <div className="tx-title">{tx.title}</div>
                <div className="tx-cat">{tx.category}</div>
              </div>
              <div className={`tx-amount ${tx.type === "INCOME" ? "green" : ""}`}>
                {tx.type === "INCOME" ? "+" : "-"}₹{Number(tx.amount).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/summary" className="action-card">
          <span className="action-icon">📊</span>
          <span className="action-text">View Monthly Report</span>
        </Link>
      </div>

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onAdded={(tx) => { setShowModal(false); onTransactionAdded(tx); }}
        />
      )}
    </div>
  );
}
