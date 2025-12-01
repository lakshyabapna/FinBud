// src/components/RecentTransactions.jsx
import React, { useEffect, useState } from "react";
import { useToast, useConfirm } from "../hooks/useToast";
import Toast from "./Toast";
import ConfirmDialog from "./ConfirmDialog";

export default function RecentTransactions({ onTxAdded, refreshKey }) {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();
  const { confirmState, showConfirm } = useConfirm();

  const fetchTx = async () => {
    // ... (existing fetch logic)
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/transactions?limit=20`, {
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
  }, [refreshKey]);

  const handleDelete = async (id) => {
    const confirmed = await showConfirm("Delete this transaction?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Delete failed");
      // refresh
      fetchTx();
      if (onTxAdded) onTxAdded();
      showToast("Transaction deleted successfully", "success");
    } catch (err) {
      showToast(err.message || "Error deleting", "error");
    }
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      {confirmState && (
        <ConfirmDialog
          message={confirmState.message}
          onConfirm={confirmState.onConfirm}
          onCancel={confirmState.onCancel}
        />
      )}
      <h3>Recent Transactions</h3>
      {loading ? <div>Loading...</div> : (
        <div>
          {txs.length === 0 ? <div className="placeholder">No transactions yet.</div> : (
            <ul className="tx-list">
              {txs.map(t => (
                <li key={t._id} className={`tx-item ${t.type === "EXPENSE" ? "expense" : "income"}`}>
                  <div>
                    <div className="tx-title">{t.title}</div>
                    <div className="tx-meta">{t.category || "Uncategorized"} • {new Date(t.date).toLocaleDateString()}</div>
                  </div>

                  <div className="tx-right">
                    <div className="tx-amount">{t.type === "EXPENSE" ? "-" : "+"} ₹ {Number(t.amount).toLocaleString()}</div>
                    <button className="link-btn" onClick={() => handleDelete(t._id)}>Delete</button>
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
