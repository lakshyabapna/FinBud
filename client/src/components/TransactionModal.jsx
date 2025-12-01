import React, { useState, useEffect } from "react";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";
import "./transactionModal.css";

export default function TransactionModal({ onClose, onAdded, editTransaction = null }) {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const { toast, showToast, hideToast } = useToast();

  const CATEGORIES = [
    { id: "Food", name: "Food & Dining" },
    { id: "Transport", name: "Transportation" },
    { id: "Utilities", name: "Utilities" },
    { id: "Shopping", name: "Shopping" },
    { id: "Entertainment", name: "Entertainment" },
    { id: "Health", name: "Health & Fitness" },
    { id: "Other", name: "Other" }
  ];

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "EXPENSE",
    category: ""
  });
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTransaction) {
      setForm({
        title: editTransaction.title || "",
        amount: editTransaction.amount || "",
        type: editTransaction.type || "EXPENSE",
        category: editTransaction.category || ""
      });
      // Check if the category is a custom one (not in predefined list)
      const isPredefined = CATEGORIES.some(c => c.name === editTransaction.category);
      if (!isPredefined && editTransaction.category) {
        setCustomCategory(editTransaction.category);
        setForm(prev => ({ ...prev, category: "Other" }));
      }
    }
  }, [editTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = editTransaction
        ? `${API_BASE}/api/transactions/${editTransaction._id}`
        : `${API_BASE}/api/transactions`;
      const method = editTransaction ? "PUT" : "POST";

      // Use custom category if "Other" is selected and customCategory is provided
      const finalCategory = form.category === "Other" && customCategory
        ? customCategory
        : form.category;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: form.title,
          amount: Number(form.amount),
          type: form.type,
          category: finalCategory,
          date: editTransaction?.date || new Date().toISOString()
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");

      showToast(editTransaction ? "Transaction updated successfully!" : "Transaction added successfully!", "success");
      setTimeout(() => onAdded(json), 1000);
    } catch (err) {
      showToast(err.message || "Error saving transaction", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tx-modal-backdrop">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <div className="tx-modal">
        <header>
          <h3>{editTransaction ? "Edit Transaction" : "Add Transaction"}</h3>
          <button className="close" onClick={onClose}>✕</button>
        </header>

        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Lunch"
          />

          <label>Amount</label>
          <input
            required
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="0.00"
          />

          <label>Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>

          <label>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">— Select —</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>

          {form.category === "Other" && (
            <>
              <label style={{ marginTop: "1rem" }}>Custom Category Name</label>
              <input
                required
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Gift, Travel, Pet Care"
              />
            </>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </button>
            <button type="button" className="ghost-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

