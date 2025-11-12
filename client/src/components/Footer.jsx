import "./Footer.css";
import logo from "../../assets/Screenshot_2025-11-11_at_2.28.23_PM-removebg-preview.png";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-left">
          <img src={logo} alt="FinBud Logo" className="nav-logo" />
          <p className="footer-tagline">
            Empowering smarter financial decisions 💡
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Signup</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>Connect with Us</h4>
          <div className="social-icons">
            <a href="https://www.linkedin.com/in/lakshya-bapna-73bb50323/" target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://www.instagram.com/lakshyabapna/" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://github.com/lakshyabapna" target="_blank" rel="noreferrer">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} FinBud. All rights reserved.</p>
      </div>
    </footer>
  );
}
