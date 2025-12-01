// src/components/TransactionModal.jsx
import React, { useState, useEffect } from "react";
import "./transactionModal.css"; // create minimal styles or include in page css

export default function TransactionModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "EXPENSE",
    categoryId: ""
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch categories to populate select
    fetch("http://localhost:5001/api/categories")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: form.title,
          amount: Number(form.amount),
          type: form.type,
          categoryId: form.categoryId ? Number(form.categoryId) : null,
          date: new Date().toISOString()
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create");
      onAdded(json);
    } catch (err) {
      alert(err.message || "Error creating transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tx-modal-backdrop">
      <div className="tx-modal">
        <header>
          <h3>Add Transaction</h3>
          <button className="close" onClick={onClose}>✕</button>
        </header>

        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input required value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />

          <label>Amount</label>
          <input required type="number" value={form.amount} onChange={(e)=>setForm({...form, amount:e.target.value})} />

          <label>Type</label>
          <select value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>

          <label>Category</label>
          <select value={form.categoryId} onChange={(e)=>setForm({...form, categoryId:e.target.value})}>
            <option value="">— Select —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <div style={{display:"flex", gap:10, marginTop:12}}>
            <button type="submit" className="primary-btn" disabled={loading}>{loading ? "Adding..." : "Add"}</button>
            <button type="button" className="ghost-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
