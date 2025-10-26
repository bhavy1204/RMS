import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuPage from './pages/MenuPage';
import QRScanner from './pages/QRScanner';
import TableMenuPage from './pages/TableMenuPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminMenu from './pages/AdminMenu';
import AdminOrders from './pages/AdminOrders';
import AdminTables from './pages/AdminTables';
import ProtectedRoute from './Components/utils/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/scan" element={<QRScanner />} />
      <Route path="/table/:slug" element={<TableMenuPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/menu/:slug" element={<MenuPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/menu"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminMenu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tables"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminTables />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/scan" replace />} />
    </Routes>
  );
}

export default App;
