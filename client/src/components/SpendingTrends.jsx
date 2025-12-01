import React, { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function SpendingTrends({ refreshKey }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch(`${API_BASE}/api/summary/trends`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const json = await res.json();
                    setData(json.trends || []);
                }
            } catch (err) {
                console.error("Error fetching trends:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [refreshKey]);

    if (loading) return <div>Loading trends...</div>;

    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h3>Monthly Spending Trends</h3>
            </div>
            <div className="chart-amount">₹{totalAmount.toLocaleString()}</div>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
