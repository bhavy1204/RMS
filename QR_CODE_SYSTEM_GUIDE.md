# QR Code Restaurant System - Complete Guide

## 🎯 Overview

This is a **full-stack MERN** restaurant management system with QR code scanning capabilities. Customers scan QR codes at their tables to view the menu and place orders.

## 🏗️ System Architecture

### User Flow

1. **Customer scans QR code** at table → `/table/:slug`
2. **Selects menu items** and adds to cart
3. **Places order** tied to the table
4. **Admin manages** orders, menu, and tables from dashboard

## 📱 How It Works

### For Customers

1. **Scan QR Code**
   - Table has a QR code with slug (e.g., `table-5`)
   - Scanning redirects to `/table/table-5`

2. **Browse Menu**
   - View menu items by category
   - Filter by categories
   - See prices, descriptions, dietary info

3. **Add to Cart**
   - Select quantity
   - Add to shopping cart
   - View cart total

4. **Place Order**
   - Checkout with table info
   - Order is created and tied to table
   - Get confirmation

### For Admins

1. **Login** with admin credentials
2. **Dashboard** shows overview
3. **Manage**:
   - Menu items & categories
   - Orders (view, update status)
   - Tables (create, generate QR codes)

## 🔐 Creating Admin Users

### Method 1: Seed Script (Easiest)

```bash
cd backend
npm run seed-admin
```

**Default credentials:**
- Email: `admin@restaurant.com`
- Password: `admin123`

### Method 2: Custom Admin

```bash
node scripts/seedAdmin.js "Your Name" "your@email.com" "yourpassword"
```

### Method 3: Upgrade Existing User

```bash
mongosh
use restaurant-qr-menu
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

⚠️ **Important**: Change default password after first login!

## 🚀 Getting Started

### 1. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (optional, works with defaults)
cp env.example .env

# Create admin user
npm run seed-admin

# Start server
npm start
# Or for development: npm run dev
```

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies (already done)
npm install

# Start dev server
npm run dev
```

### 3. Access the App

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/health`

## 🗂️ Routes

### Public Routes

- `/` - Redirects to QR scanner
- `/scan` - QR code entry page
- `/table/:slug` - Table menu page
- `/menu` - General menu (no table)
- `/login` - Login page
- `/register` - Registration page

### Admin Routes (Protected)

- `/admin` - Admin dashboard
- `/admin/menu` - Manage menu items
- `/admin/orders` - View/manage orders
- `/admin/tables` - Manage tables & QR codes

## 📊 Database Models

### Users
- **Roles**: `customer`, `staff`, `admin`
- **Default**: `customer`

### Tables
- `number`: Table number (e.g., "5")
- `qrSlug`: URL slug (e.g., "table-5")
- `capacity`: Seating capacity
- `location`: Table location
- `isActive`: Active status

### Menu Items
- Name, description, price
- Category, availability
- Dietary info (vegetarian, vegan, gluten-free)
- Image URL

### Orders
- Linked to table
- Linked to customer (optional)
- Items with quantity & notes
- Status: placed → preparing → ready → served

## 🔧 Features Implemented

### ✅ Complete

- [x] User authentication (register/login/logout)
- [x] JWT tokens with refresh
- [x] QR code scanning flow
- [x] Table-specific menu browsing
- [x] Shopping cart functionality
- [x] Order creation with table linking
- [x] Admin dashboard
- [x] Protected routes by role
- [x] Responsive design
- [x] Toast notifications
- [x] Category filtering
- [x] CORS configuration

### 🔨 To Implement

- [ ] Order status updates (staff view)
- [ ] Real-time QR code scanner (camera)
- [ ] QR code generation for tables (admin)
- [ ] Table management UI
- [ ] Order history for customers
- [ ] Menu CRUD operations (admin)
- [ ] File upload for menu images
- [ ] Search functionality
- [ ] Popular items showcase
- [ ] Payment integration

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get profile

### Menu
- `GET /api/menu/categories` - Get categories
- `GET /api/menu/items` - Get menu items
- `GET /api/menu/items/:id` - Get item by ID

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/me` - My orders
- `GET /api/orders/me/:id` - Get order
- `PATCH /api/orders/me/:id/cancel` - Cancel order

### Tables
- `GET /api/tables/by-slug/:slug` - Get table by slug

## 🧪 Testing the System

### 1. Test Registration
```
POST http://localhost:5000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

### 2. Test Table Access
```
GET http://localhost:5000/api/tables/by-slug/table-1
```

### 3. Test Menu
```
GET http://localhost:5000/api/menu/items
```

### 4. Test Admin Login
- Email: `admin@restaurant.com`
- Password: `admin123`
- Should redirect to `/admin`

## 🐛 Troubleshooting

### Can't login as admin?
```bash
# Check if user exists
mongosh
use restaurant-qr-menu
db.users.findOne({ email: "admin@restaurant.com" })
```

### CORS errors?
- Check `backend/config/config.js` has correct CORS_ORIGIN
- Restart backend server

### Orders not saving?
- Check MongoDB connection
- Verify tableId is being sent

### Cart not working?
- Check browser localStorage
- Verify Redux store is configured

## 📚 Next Steps

1. **Create QR codes** for your tables
2. **Add menu items** via admin panel
3. **Create staff accounts** (role: "staff")
4. **Generate table QR codes** (to be implemented)
5. **Deploy** to production

## 🔒 Security Notes

- ✅ Passwords are hashed with bcrypt (12 rounds)
- ✅ JWT tokens with short expiration
- ✅ Role-based access control
- ✅ Rate limiting on API
- ✅ Helmet security headers
- ✅ CORS configured

## 📞 Support

For issues or questions:
1. Check this guide
2. Review backend logs
3. Check browser console
4. Verify MongoDB is running

---

**Built with:** MongoDB, Express, React, Node.js, Redux Toolkit, Tailwind CSS, Axios








