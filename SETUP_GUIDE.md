# Frontend-Backend Connection Setup Guide

## ✅ Connection is NOW Configured!

The frontend and backend are fully connected. Here's what has been set up:

### 🔧 Connection Details

**Backend API:** `http://localhost:5000/api`  
**Frontend Dev Server:** `http://localhost:5173`  
**CORS:** Configured to allow requests from frontend

### 📋 What's Connected

1. **Authentication**
   - Login: `POST /api/auth/login`
   - Register: `POST /api/auth/register`
   - Token refresh: `POST /api/auth/refresh`
   - Profile: `GET /api/auth/profile`

2. **Menu Management**
   - Get categories: `GET /api/menu/categories`
   - Get menu items: `GET /api/menu/items`
   - Get item by ID: `GET /api/menu/items/:id`

3. **Orders**
   - Create order: `POST /api/orders`
   - Get my orders: `GET /api/orders/me`
   - Get order by ID: `GET /api/orders/me/:id`
   - Cancel order: `PATCH /api/orders/me/:id/cancel`

4. **Tables**
   - Get table by slug: `GET /api/tables/by-slug/:slug`

### 🚀 How to Run

#### 1. Start the Backend

```bash
cd backend
npm install  # If you haven't already
npm start    # Or node server.js
```

The backend will run on `http://localhost:5000`

#### 2. Start the Frontend

```bash
cd frontend
npm install  # If you haven't already (Redux Toolkit should already be installed)
npm run dev
```

The frontend will run on `http://localhost:5173`

### 🧪 Test the Connection

1. Open your browser to `http://localhost:5173`
2. You should see the menu page
3. Click "Login" or "Sign up" to test authentication
4. Try browsing menu items

### 🔑 Authentication Flow

1. User registers/logs in
2. Backend returns `accessToken` and `refreshToken`
3. Tokens stored in `localStorage`
4. All API requests include `Authorization: Bearer <token>` header
5. If token expires, automatically refreshes
6. On 401 error, redirects to login

### 📡 API Configuration

**Frontend (`src/axios.js`):**
```javascript
baseURL: "http://localhost:5000/api"
```

**Backend (`config/config.js`):**
```javascript
CORS_ORIGIN: 'http://localhost:5173'
```

### 🎨 Features Connected

✅ User authentication (login/register/logout)  
✅ Menu browsing with categories  
✅ Shopping cart functionality  
✅ Order creation and tracking  
✅ Admin dashboard with protected routes  
✅ Automatic token refresh  
✅ Role-based access control  

### 🐛 Troubleshooting

**CORS errors:**
- Make sure backend config has `CORS_ORIGIN: http://localhost:5173`
- Restart the backend server after changing config

**API not responding:**
- Check backend is running on port 5000
- Check MongoDB is running
- Check browser console for errors

**401 Unauthorized:**
- Clear localStorage and login again
- Check tokens are being sent in headers

**Cannot connect to backend:**
- Verify backend is running: `curl http://localhost:5000/health`
- Check firewall settings
- Try `http://localhost:5000/api/auth/profile`

### 📝 Environment Variables

If you need to customize, create a `.env` file in the `backend` folder:

```bash
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/restaurant-qr-menu
```

### ✅ You're All Set!

The frontend is fully connected to your backend. Start both servers and begin using the application!








