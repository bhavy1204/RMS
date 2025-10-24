# Restaurant QR Menu System - Backend

A comprehensive backend API for a Restaurant QR Menu System built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Customer, Staff, Admin)
- **Menu Management**: CRUD operations for categories and menu items with search, filtering, and pagination
- **Table Management**: QR code generation for tables with unique slugs
- **Order Management**: Complete order lifecycle with status tracking
- **Real-time Updates**: Order status updates and notifications
- **Analytics**: Order analytics and reporting
- **Security**: Rate limiting, input validation, and security headers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, cors
- **Validation**: express-validator
- **QR Code**: qrcode library
- **File Upload**: multer

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant-qr-menu
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
FRONTEND_URL=http://localhost:3000
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Menu
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/items` - Get menu items (with search, filter, pagination)
- `GET /api/menu/items/:id` - Get single menu item
- `POST /api/menu/categories` - Create category (Admin)
- `PUT /api/menu/categories/:id` - Update category (Admin)
- `DELETE /api/menu/categories/:id` - Delete category (Admin)
- `POST /api/menu/items` - Create menu item (Admin)
- `PUT /api/menu/items/:id` - Update menu item (Admin)
- `DELETE /api/menu/items/:id` - Delete menu item (Admin)
- `PATCH /api/menu/items/:id/toggle-availability` - Toggle availability (Staff/Admin)
- `GET /api/menu/analytics` - Get menu analytics (Admin)

### Tables
- `GET /api/tables/by-slug/:slug` - Get table by QR slug (Public)
- `GET /api/tables` - Get all tables (Admin)
- `GET /api/tables/:id` - Get single table (Admin)
- `POST /api/tables` - Create table (Admin)
- `PUT /api/tables/:id` - Update table (Admin)
- `DELETE /api/tables/:id` - Delete table (Admin)
- `PATCH /api/tables/:id/toggle-status` - Toggle table status (Admin)
- `GET /api/tables/:id/qr` - Generate QR code (Admin)
- `GET /api/tables/qr/bulk-generate` - Bulk generate QR codes (Admin)

### Orders
- `POST /api/orders` - Create order (Public with optional auth)
- `GET /api/orders` - Get orders (Staff/Admin)
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status (Staff/Admin)
- `GET /api/orders/me` - Get customer's orders
- `PATCH /api/orders/me/:id/cancel` - Cancel order (Customer)
- `GET /api/orders/analytics/overview` - Get order analytics (Admin)

### Public Menu Route
- `GET /api/menu/by-table/:slug` - Get menu for specific table (Public)

## Database Models

### User
- `name`: String (required)
- `email`: String (required, unique)
- `passwordHash`: String (required)
- `role`: Enum ['customer', 'staff', 'admin']
- `isActive`: Boolean
- `refreshToken`: String

### Table
- `number`: String (required, unique)
- `qrSlug`: String (required, unique)
- `activeSessionId`: String
- `isActive`: Boolean
- `capacity`: Number
- `location`: String

### MenuCategory
- `name`: String (required)
- `displayOrder`: Number (required)
- `active`: Boolean
- `description`: String
- `imageUrl`: String

### MenuItem
- `name`: String (required)
- `description`: String (required)
- `price`: Number (required)
- `categoryId`: ObjectId (ref: MenuCategory)
- `imageUrl`: String
- `availability`: Boolean
- `tags`: [String]
- `allergens`: [String]
- `preparationTime`: Number
- `calories`: Number
- `isVegetarian`: Boolean
- `isVegan`: Boolean
- `isGlutenFree`: Boolean
- `popularityScore`: Number

### Order
- `tableId`: ObjectId (ref: Table)
- `customerId`: ObjectId (ref: User, optional)
- `items`: [Object] (menuItemId, quantity, note, price)
- `status`: Enum ['placed', 'preparing', 'ready', 'served', 'canceled']
- `subtotal`: Number
- `tax`: Number
- `total`: Number
- `orderNumber`: String (unique)
- `estimatedReadyTime`: Date
- `specialInstructions`: String
- `paymentStatus`: Enum ['pending', 'paid', 'refunded']
- `paymentMethod`: Enum ['cash', 'card', 'digital']

## Authentication & Authorization

### Roles
- **Customer**: Can browse menu, place orders, view own orders
- **Staff**: Can manage orders, toggle item availability
- **Admin**: Full access to all features

### JWT Tokens
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens

## Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation using express-validator
- **Password Hashing**: bcryptjs with configurable rounds
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **SQL Injection Protection**: Mongoose ODM protection

## QR Code Generation

QR codes are generated for each table and contain URLs like:
```
http://localhost:3000/m/table-1
```

The QR codes link to the frontend menu page with the table context embedded in the URL.

## Error Handling

The API uses consistent error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Environment Variables
See `env.example` for all available configuration options.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

