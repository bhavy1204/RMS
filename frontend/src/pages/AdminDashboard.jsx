import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../store/slices/authSlice';
import AdminNav from '../Components/utils/AdminNav';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Menu Management */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Menu Management</h2>
            </div>
            <p className="text-gray-600 mb-4">Manage menu items and categories</p>
            <button
              onClick={() => navigate('/admin/menu')}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Manage Menu
            </button>
          </div>

          {/* Orders Management */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Orders</h2>
            </div>
            <p className="text-gray-600 mb-4">View and manage orders</p>
            <button
              onClick={() => navigate('/admin/orders')}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              View Orders
            </button>
          </div>

          {/* Tables Management */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Tables</h2>
            </div>
            <p className="text-gray-600 mb-4">Manage restaurant tables</p>
            <button
              onClick={() => navigate('/admin/tables')}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Manage Tables
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

