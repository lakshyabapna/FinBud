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

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function CategoryDonut({ apiUrl = `${API_BASE}/api/summary/category`, refreshKey }) {
  // ... (existing state)
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      // ... (existing fetch logic)
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (!cancelled) setData([]);
          return;
        }

        const res = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (!cancelled) setData([]);
          return;
        }

        const json = await res.json();
        if (json && json.categories) {
          if (!cancelled) {
            setData(json.categories.map((d, idx) => ({
              name: d.name,
              amount: Number(d.amount || 0),
              color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
            })));
            setTotal(json.categories.reduce((acc, curr) => acc + Number(curr.amount || 0), 0));
          }
        } else {
          if (!cancelled) setData([]);
        }
      } catch (err) {
        console.error("Error fetching category summary:", err);
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [apiUrl, refreshKey]);

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
