
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h1>Smarter Way to Manage Your Finances</h1>
          <p>
            FinBud helps you track your expenses, set budgets, and get
            AI-powered insights for better savings and smarter decisions.
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => navigate("/signup")}
              className="primary-btn"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="secondary-btn"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>💸 Track Your Spending</h3>
          <p>
            Record every income and expense to understand where your money goes
            — effortlessly.
          </p>
        </div>
        <div className="feature-card">
          <h3>📊 Visualize Finances</h3>
          <p>
            View analytics and charts to identify trends and plan your monthly
            budget with ease.
          </p>
        </div>
        <div className="feature-card">
          <h3>🤖 Smart Insights</h3>
          <p>
            Get AI-driven summaries and personalized financial insights tailored
            to your habits.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}


