import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first to access the dashboard");
    return <Navigate to="/login" replace />;
  }

  return children;
}
