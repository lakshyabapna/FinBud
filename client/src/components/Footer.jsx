import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-left">
          <h2 className="footer-logo">FinBud</h2>
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
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
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
