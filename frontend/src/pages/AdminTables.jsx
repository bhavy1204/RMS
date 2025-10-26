import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AdminNav from '../Components/utils/AdminNav';
import toast from 'react-hot-toast';

const AdminTables = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch tables logic will go here
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Tables Management</h1>
          <p className="text-gray-600">Table management functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminTables;

