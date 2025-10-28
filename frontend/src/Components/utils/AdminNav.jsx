import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const AdminNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Restaurant Management</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              to="/admin"
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                isActive('/admin') && location.pathname !== '/admin/menu' && location.pathname !== '/admin/orders' && location.pathname !== '/admin/tables'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/menu"
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                isActive('/admin/menu')
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Menu
            </Link>
            <Link
              to="/admin/orders"
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                isActive('/admin/orders')
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders
            </Link>
            <Link
              to="/admin/tables"
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                isActive('/admin/tables')
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tables
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AdminNav;

