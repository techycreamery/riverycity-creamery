# 🍦 River City Creamery

A full-stack ice cream delivery app built with React and Node.js. Customers can browse flavors, place orders, and track delivery status.

---

## 🚀 Quick Start

### Frontend (React)
```bash
cd client
npm install
npm start

### Backend (Express + MongoDB)
```bash
cd server
npm install
npm start

---

## 🌐 Environment Variables

### `client/.env`

REACT_APP_API_URL=http://localhost:5000


Used by the React app to connect to the backend API. In production, update this to your Render URL (e.g. `https://your-backend.onrender.com`).

---

### `server/.env`

MONGODB_URI=your-mongodb-uri
STRIPE_SECRET_KEY=your-stripe-secret-key
OPENAI_API_KEY=your-openai-api-key
OPENAI_ORDER_SUPPORT_MODEL=gpt-5-mini

`MONGODB_URI` and `STRIPE_SECRET_KEY` support database and payments on the backend.
`OPENAI_API_KEY` enables the AI order support chat. If it is omitted, the chat falls back to deterministic lookup responses.

---

## 🏁 Deployment Notes

This project is designed for modern cloud deployment using [Vercel](https://vercel.com) and [Render](https://render.com).

---

### 🔷 Frontend (React via Vercel)

- **Framework Preset:** Create React App
- **Root Directory:** `client`
- **Install Command:** `npm install`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Environment Variable (Optional):**

REACT_APP_API_URL=https://your-backend-api.onrender.com


---

### 🔶 Backend (Express via Render)

- **Service Type:** Web Service
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**

MONGODB_URI=your-mongodb-uri
STRIPE_SECRET_KEY=your-stripe-secret-key
OPENAI_API_KEY=your-openai-api-key
OPENAI_ORDER_SUPPORT_MODEL=gpt-5-mini


Make sure to set these in the **Render Dashboard > Environment** tab.

---

### 🌐 Connect Frontend to Backend

1. In your deployed frontend, update the `.env` variable:
REACT_APP_API_URL=https://your-backend-api.onrender.com


2. Rebuild and redeploy on Vercel (automatic on GitHub push if linked).

---

### ✅ Done!

Once deployed:
- React will serve your frontend on Vercel (e.g. `https://river-city-creamery.vercel.app`)
- Express will serve your API on Render (e.g. `https://river-city-creamery-api.onrender.com`)
- Your full stack is now live!
