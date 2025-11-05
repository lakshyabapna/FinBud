import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to FinBud</h1>
      <div>
        <button onClick={() => navigate("/signup")}>
          Signup
        </button>
        <button onClick={() => navigate("/login")}>
          Login
        </button>
        <button
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}


