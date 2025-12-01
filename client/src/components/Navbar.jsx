import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import appLogo from "../../assets/image-removebg-preview.png";
import landingLogo from "../../assets/Screenshot_2025-11-11_at_2.28.23_PM-removebg-preview.png";
import "./navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const isLandingPage = location.pathname === "/";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className={`navbar ${isLandingPage ? "navbar-transparent" : ""}`}>
      <div className="navbar-brand">
        <img src={isLandingPage ? landingLogo : appLogo} alt="FinBud Logo" className="navbar-logo" />
      </div>
      {!isLandingPage && (
        <>
          <div className="navbar-links">
            <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
              Dashboard
            </Link>
            <Link to="/transactions" className={`nav-link ${isActive("/transactions") ? "active" : ""}`}>
              Transactions
            </Link>
            <Link to="/summary" className={`nav-link ${isActive("/summary") ? "active" : ""}`}>
              Summary
            </Link>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}
