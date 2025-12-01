// src/components/ProtectedRoute.jsx
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
        // Try to read token(s) from localStorage (support both keys)
        const localToken =
          localStorage.getItem("token") || localStorage.getItem("finbud_token");

        // Build headers — include Authorization only if a token exists.
        const headers = { "Content-Type": "application/json" };
        if (localToken) headers.Authorization = `Bearer ${localToken}`;

        // Call /api/auth/me on the configured backend.
        // credentials: 'include' allows cookie-based sessions to be sent as well.
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        if (!isMounted) return;

        if (res.ok) {
          // Optionally you could parse the user here:
          // const body = await res.json();
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

  // Show a basic loading placeholder until verification finishes.
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
    // Not authenticated — redirect to login, preserve intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated — render children (protected content)
  return children;
}
