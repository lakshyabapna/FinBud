FinBud - A Smart Personal Finance Buddy
FinBud helps users take control of their personal finances through a smart, intuitive, and AI-powered platform. It simplifies expense tracking, savings analysis, and budget planning, empowering users to make smarter financial decisions effortlessly.

Problem Statement
Managing personal finances can often feel confusing and time-consuming. People struggle to monitor where their money goes, how much they save, and whether they’re meeting their goals.

FinBud solves this by offering:

A simple way to record income and expenses.

Real-time visual insights and summaries.

AI-generated financial insights to improve savings and spending behavior.

System Architecture
Architecture Flow:
Frontend → Backend (API) → Database

Tech Stack Overview:

Layer	Technology
Frontend	React.js, React Router, Recharts
Backend	Node.js, Express.js
Database	MySQL
Authentication	JWT (JSON Web Tokens)
AI	OpenAI API
Hosting	Frontend – Vercel, Backend – Render
Hosting Setup:

Frontend → Vercel

Backend → Render

Database → MySQL(aiven)

Data Flow:

The user interacts with the frontend (dashboard, charts, forms).

The frontend sends API requests to the backend.

The backend interacts with the database and processes logic.

Responses are sent back to the frontend, which displays real-time data visualizations.

Key Features
Category	Features
Authentication & Authorization	Secure user registration, login/logout via JWT
Transaction Management (CRUD)	Add, edit, delete, and view income/expense transactions
Dashboard & Analytics	Real-time display of income, expenses, and balance
Category-wise Charts	Visualize spending using Pie and Line Charts
Budget Planning	Set monthly limits and receive alerts when nearing them
AI Financial Insights	Analyze spending and get insights like “You spent 30% more this month on food.”
Frontend Routing	Pages: Home, Login, Signup, Dashboard, Transactions, Add Transaction, Profile

API Overview
Endpoint	Method	Description	Access
/api/auth/signup	POST	Register new user	Public
/api/auth/login	POST	Authenticate user	Public
/api/transactions	GET	Retrieve all transactions	Authenticated
/api/transactions	POST	Add new transaction	Authenticated
/api/transactions/:id	PUT	Edit existing transaction	Authenticated
/api/transactions/:id	DELETE	Delete transaction	Authenticated
/api/summary/monthly	GET	Fetch monthly income, expense, and balance summary	Authenticated
/api/summary/category	GET	Get category-wise breakdown for charts	Authenticated
/api/ai/insight	POST	Generate AI-based financial summary	Authenticated

Installation & Setup
Prerequisites
Node.js (v18+ recommended)

MySQL Database

OpenAI API key

Steps
Clone the repository

bash
git clone https://github.com/yourusername/FinBud.git
cd FinBud
Backend Setup

bash
cd backend
npm install
Create a .env file and configure:

text
PORT=5000
DATABASE_URL=your_mysql_connection_url
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_api_key

Run backend:

bash
npm start
Frontend Setup

bash
cd ../frontend
npm install
npm run dev
Open your browser and visit:

text
http://localhost:5173

Future Enhancements
Integration with bank APIs for automated transaction imports

Machine learning-based savings suggestions

Multi-currency support

Dark mode and user theme customization

License
This project is licensed under the MIT License – feel free to use and modify it.

