
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState({ loading: true, ok: false });
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      try {
      
        const localToken =
          localStorage.getItem("token") || localStorage.getItem("finbud_token");

       
        const headers = { "Content-Type": "application/json" };
        if (localToken) headers.Authorization = `Bearer ${localToken}`;

        const res = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        if (!isMounted) return;

        if (res.ok) {
          
          setStatus({ loading: false, ok: true });
        } else {
          setStatus({ loading: false, ok: false });
        }
      } catch (err) {
        if (!isMounted) return;
        setStatus({ loading: false, ok: false });
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, []);

 
  if (status.loading) {
    return (
      <div style={{
        width: "100%",
        height: "100vh",
        display: "grid",
        placeItems: "center",
        fontSize: 16,
      }}>
        Checking authentication...
      </div>
    );
  }

  if (!status.ok) {
   
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return children;
}
