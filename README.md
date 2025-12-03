# FinBud — A Smart Personal Finance Buddy

**FinBud** helps users take control of their personal finances through an intuitive, AI-powered platform. It simplifies expense tracking, savings analysis, and budget planning — empowering users to make smarter financial decisions effortlessly.

---

## 🚨 Problem Statement

Managing personal finances can feel confusing and time-consuming. People struggle to monitor spending, track savings, and meet their financial goals.

**FinBud solves this by providing:**
- A simple way to record income and expenses
- Real-time visual insights and summaries
- AI-generated financial insights to improve spending and savings behavior

---

## 🏗️ System Architecture

**Architecture Flow:**  
**Frontend → Backend (API) → Database**

### Tech Stack

| Layer              | Technology                  |
|--------------------|-----------------------------|
| **Frontend**       | React.js, React Router, Recharts |
| **Backend**        | Node.js, Express.js         |
| **Database**       | MongoDB                     |
| **Authentication** | JWT (JSON Web Tokens)       |
| **AI**             | OpenAI API                  |
| **Hosting**        | Frontend — Vercel, Backend — Render |

### Data Flow
1. User interacts with the frontend (dashboard, charts, forms).
2. The frontend sends API requests to the backend.
3. The backend communicates with MongoDB to store and retrieve data.
4. The frontend displays real-time insights and charts to the user.

---

## ⭐ Key Features

- **Authentication (JWT):** Secure signup & login
- **Transaction Management:** Add, edit, delete transactions
- **Dashboard & Analytics:** Real-time income, expenses & balance
- **Spending Charts:** Pie + line charts using Recharts
- **Budget Planning:** Set monthly limits and track progress
- **AI Insights:** Smart summaries like *"You spent 30% more on food this month."*
- **Clean Routing:** Home, Login, Signup, Dashboard, History, Add Transaction, Profile

---

## 📡 API Overview

| Endpoint                  | Method | Description                  | Access |
|---------------------------|--------|------------------------------|--------|
| `/api/auth/signup`        | POST   | Register a new user          | Public |
| `/api/auth/login`         | POST   | Authenticate a user          | Public |
| `/api/transactions`       | GET    | Get all transactions         | Auth   |
| `/api/transactions`       | POST   | Add a new transaction        | Auth   |
| `/api/transactions/:id`   | PUT    | Update a transaction         | Auth   |
| `/api/transactions/:id`   | DELETE | Delete a transaction         | Auth   |
| `/api/summary/monthly`    | GET    | Monthly summary              | Auth   |
| `/api/summary/category`   | GET    | Category-wise summary        | Auth   |
| `/api/ai/insight`         | POST   | AI-powered financial summary | Auth   |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Database (Atlas or local)
- OpenAI API key

### Clone Repository
git clone https://github.com/lakshyabapna/FinBud.git
cd FinBud
### Backend Setup
npm install

Create a `.env` file in the `backend` directory:
PORT=5000
DATABASE_URL=your_mongodb_connection_url
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_api_key

Start the backend server:
npm start

or for development
npm run dev

Start the frontend development server:
npm run dev


