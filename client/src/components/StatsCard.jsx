import React from "react";
export default function StatsCard({ label, value, prefix = "" }) {
  const formatted = typeof value === "number" ? value.toLocaleString() : value;
  return (
    <div className="stats-card">
      <div className="label">{label}</div>
      <div className="value">{prefix}{formatted}</div>
    </div>
  );
}
