# Weather Dashboard

This project is a full-stack weather analytics dashboard with a React (Vite) frontend and an Express.js backend.

## [Live Project Link](https://visual-kohl.vercel.app/)

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/Adityasinghvats/weather-dashboard.git
cd weather-dashboard
```

---

## Backend Setup

1. Navigate to the backend folder:
	```sh
	cd backend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Create a `.env` file in the `backend` directory (see `.env.example` if available) and add your environment variables:
	```env
	MONGO_URI=your_mongodb_connection_string
	PORT=3000
	CORS_ORIGIN=http://localhost:5173
	NODE_ENV=development
	```
4. Start the backend server:
	```sh
	npm start
	```
	The backend will run on [http://localhost:3000](http://localhost:3000).

---

## Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
	```sh
	cd frontend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Start the frontend development server:
	```sh
	npm run dev
	```
	The frontend will run on [http://localhost:5173](http://localhost:5173).

---

## Usage

1. Make sure both backend and frontend servers are running.
2. Open [http://localhost:5173](http://localhost:5173) in your browser to use the dashboard.

---

## Project Structure

```
weather-dashboard/
  backend/    # Express.js backend
  frontend/   # React (Vite) frontend
```

---
