import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      if (!checked) {
        setChecked(true);
        navigate("/login", { replace: true }); 
      }
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
        if (!checked) {
          setChecked(true);
          navigate("/login", { replace: true });
        }
      });
  }, [navigate, checked]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <h1>FinBud Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button>
            Logout
          </button>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
