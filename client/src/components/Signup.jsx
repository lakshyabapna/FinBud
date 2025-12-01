import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";
import "./Auth.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Signup failed");

      showToast("Signup successful! Redirecting to login...", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <div className="auth-box">
        <h2>Create your <span className="highlight">FinBud</span> Account</h2>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter your full name"
          />

          <label>Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="example@email.com"
          />

          <label>Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter a secure password"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login" className="link">Log in</Link>
        </p>
      </div>
    </div>
  );
}
