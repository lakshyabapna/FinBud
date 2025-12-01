// src/components/RecentTransactions.jsx
import React, { useEffect, useState } from "react";

export default function RecentTransactions({ onTxAdded }) {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTx = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/transactions?limit=20", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setTxs(json.transactions || json || []);
    } catch (err) {
      console.warn(err);
      setTxs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTx();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Delete failed");
      // refresh
      fetchTx();
      if (onTxAdded) onTxAdded();
    } catch (err) {
      alert(err.message || "Error deleting");
    }
  };

  return (
    <div>
      <h3>Recent Transactions</h3>
      {loading ? <div>Loading...</div> : (
        <div>
          {txs.length === 0 ? <div className="placeholder">No transactions yet.</div> : (
            <ul className="tx-list">
              {txs.map(t => (
                <li key={t.id} className={`tx-item ${t.type === "EXPENSE" ? "expense" : "income"}`}>
                  <div>
                    <div className="tx-title">{t.title}</div>
                    <div className="tx-meta">{t.categoryName || "Uncategorized"} • {new Date(t.date).toLocaleDateString()}</div>
                  </div>

                  <div className="tx-right">
                    <div className="tx-amount">{t.type === "EXPENSE" ? "-" : "+"} ₹ {Number(t.amount).toLocaleString()}</div>
                    <button className="link-btn" onClick={()=>handleDelete(t.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
