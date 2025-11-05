import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login or sign up first to access the dashboard.");
      navigate("/login");
      return;
    }

    fetch("http://localhost:5001/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error("Invalid token");
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        alert("Session expired. Please login again.");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1>FinBud Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, {user.name}! 👋</p>
          <p>Email: {user.email}</p>
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "8px 15px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
