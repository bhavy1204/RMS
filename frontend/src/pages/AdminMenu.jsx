import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuItems } from '../store/slices/menuSlice';
import AdminNav from '../Components/utils/AdminNav';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isLoading } = useSelector((state) => state.menu);

  useEffect(() => {
    dispatch(fetchMenuItems({}));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Menu Items</h1>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
              Add Item
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : items.length === 0 ? (
            <p className="text-gray-600">No menu items found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <p className="text-orange-500 font-bold">${item.price.toFixed(2)}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition">
                      Edit
                    </button>
                    <button className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;

