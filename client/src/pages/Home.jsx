import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/Financial_analysis_Illustration-removebg-preview.png";

import spendingIcon from "../../assets/1st.png";
import chartIcon from "../../assets/_-removebg-preview.png";
import aiIcon from "../../assets/Economics_business_icon-removebg-preview.png";

import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar />

      <section className="hero">
        <div className="hero-left">
          <img src={heroImage} alt="FinBud Hero" className="hero-image" />
        </div>

        <div className="hero-right">
          <h1>Smarter Way to Manage Your Finances</h1>
          <p>
            FinBud helps you track your expenses, set budgets, and get
             insights for better savings and smarter decisions.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/signup")} className="primary-btn">
              Get Started
            </button>
            <button onClick={() => navigate("/login")} className="secondary-btn">
              Login
            </button>
          </div>
        </div>
      </section>

      <section className="offers">
        <h2>What FinBud Offers</h2>
        <p>
          Everything you need to take control of your financial future - all in one place.
        </p>
      </section>

      <section className="features">
        <div className="feature-card">
          <img src={spendingIcon} alt="Track Spending" className="feature-icon" />
          <h3>Track Your Spending</h3>
          <p>
            Record every income and expense to understand where your money goes effortlessly.
          </p>
        </div>

        <div className="feature-card">
          <img src={chartIcon} alt="Visualize Finances" className="feature-icon" />
          <h3>Visualize Finances</h3>
          <p>
            View analytics and charts to identify trends and plan your monthly budget with ease.
          </p>
        </div>

        <div className="feature-card">
          <img src={aiIcon} alt="Smart Insights" className="feature-icon" />
          <h3>Smart Insights</h3>
          <p>
            Get summaries and personalized financial insights tailored to your habits.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
