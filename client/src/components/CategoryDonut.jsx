// CategoryDonut.jsx
import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./CategoryDonut.css";

const DEFAULT_COLORS = [
  "#4C7BFF", "#00C2A8", "#FFB86B", "#FF7A76",
  "#A78BFA", "#60A5FA", "#34D399", "#F97316",
  "#EF4444", "#64748B"
];

export default function CategoryDonut({ apiUrl = "http://localhost:5001/api/summary/category" }) {
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        // if no token, skip fetching (user not logged in)
        if (!token) {
          // optional: use mock
          if (!cancelled) applyMock();
          return;
        }

        const res = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // if backend not ready or returns 401/403, fallback to mock
          const errText = await res.text().catch(()=>"");
          console.warn("Category summary fetch failed:", res.status, errText);
          if (!cancelled) applyMock();
          return;
        }

        const json = await res.json();
        if (json && json.breakdown) {
          if (!cancelled) {
            setData(json.breakdown.map((d, idx) => ({
              name: d.name,
              amount: Number(d.amount || 0),
              color: d.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
            })));
            setTotal(Number(json.totalExpense || 0));
          }
        } else {
          if (!cancelled) applyMock();
        }
      } catch (err) {
        console.error("Error fetching category summary:", err);
        if (!cancelled) applyMock();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    function applyMock() {
      const mock = [
        { name: "Food", amount: 4200, color: "#FFB86B" },
        { name: "Transport", amount: 2100, color: "#60A5FA" },
        { name: "Subscriptions", amount: 900, color: "#A78BFA" },
        { name: "Shopping", amount: 700, color: "#FF7A76" }
      ];
      setData(mock);
      setTotal(mock.reduce((s, x) => s + x.amount, 0));
      setLoading(false);
    }

    fetchData();
    return () => { cancelled = true; };
  }, [apiUrl]);

  if (loading) {
    return <div className="donut-placeholder">Loading chart…</div>;
  }

  if (!data || data.length === 0) {
    return <div className="donut-placeholder">No expense data yet</div>;
  }

  return (
    <div className="donut-wrapper">
      <h3 className="donut-title">Where your money went (this month)</h3>
      <div className="donut-chart">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹ ${Number(value).toFixed(2)}`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="donut-total">Total expenses: <strong>₹ {Number(total).toLocaleString()}</strong></div>
    </div>
  );
}
