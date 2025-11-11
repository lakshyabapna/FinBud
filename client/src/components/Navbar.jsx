import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/Screenshot_2025-11-11_at_2.28.23_PM-removebg-preview.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [isTransparent, setIsTransparent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsTransparent(true);
      } else {
        setIsTransparent(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isTransparent ? "transparent-bg" : ""}`}>
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={logo} alt="FinBud Logo" className="nav-logo" />
      </div>

      <ul className="nav-menu">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        <li onClick={() => navigate("/login")}>Login</li>
      </ul>

      <button onClick={() => navigate("/signup")} className="signup-btn">
        Signup
      </button>
    </nav>
  );
}
