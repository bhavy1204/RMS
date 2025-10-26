# Restaurant Management Frontend

A modern, responsive React frontend for the restaurant management system built with React, Redux Toolkit, Tailwind CSS, and Axios.

## Features

### Customer Features
- **Menu Browsing**: View menu items with categories, images, and descriptions
- **Shopping Cart**: Add items to cart, adjust quantities, and checkout
- **User Authentication**: Login and registration with JWT token management
- **Responsive Design**: Mobile-first responsive UI with Tailwind CSS
- **Order Management**: View order history and track order status

### Admin Features
- **Dashboard**: Overview of menu, orders, and tables
- **Menu Management**: CRUD operations for menu items and categories
- **Order Management**: View and manage all orders
- **Table Management**: Manage restaurant tables and QR codes
- **Role-based Access Control**: Protected routes based on user roles

## Tech Stack

- **React 19**: Modern React with hooks
- **Redux Toolkit**: State management with RTK Query
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Hot Toast**: Beautiful toast notifications
- **Vite**: Fast build tool and dev server

## Project Structure

```
frontend/
├── src/
│   ├── Components/
│   │   └── utils/          # Shared UI components
│   ├── pages/             # Page components
│   ├── store/              # Redux store configuration
│   │   └── slices/         # Redux slices
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── axios.js            # Axios configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api`. Configure the base URL in `src/axios.js`.

### Authentication

- Tokens are stored in localStorage
- Automatic token refresh on 401 errors
- Protected routes require authentication

### Available Endpoints

- **Auth**: `/api/auth/` - Login, register, logout
- **Menu**: `/api/menu/` - Get categories and items
- **Orders**: `/api/orders/` - Create and manage orders
- **Tables**: `/api/tables/` - Table management

## User Roles

- **Customer**: Browse menu, place orders
- **Admin**: Full system access (menu, orders, tables)
- **Staff**: Can update order statuses (to be implemented)

## Customization

### Theme Colors

Edit the color scheme in components using Tailwind classes:
- Primary: `orange-500`
- Secondary: `blue-500`
- Success: `green-500`
- Danger: `red-500`

### API Configuration

Update the base URL in `src/axios.js`:
```javascript
baseURL: "http://localhost:5000/api"
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development

The frontend uses:
- Hot Module Replacement (HMR) for fast development
- ESLint for code quality
- Vite for blazing fast builds

## License

MIT
