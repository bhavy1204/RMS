import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTableBySlug} from '../store/slices/tableSlice';
import { setTable } from '../store/slices/cartSlice';
import { fetchCategories, fetchMenuItems } from '../store/slices/menuSlice';
import { addToCart } from '../store/slices/cartSlice';
import MenuItem from '../Components/utils/MenuItem';
import Cart from '../Components/utils/Cart';
import toast from 'react-hot-toast';

const TableMenuPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentTable, isLoading: tableLoading } = useSelector((state) => state.tables);
  const { categories, items, isLoading: menuLoading } = useSelector((state) => state.menu);
  const { items: cartItems } = useSelector((state) => state.cart);
  
  const [activeCategory, setActiveCategory] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(fetchTableBySlug(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (currentTable) {
      // Set table in cart state (handle id or _id from backend)
      const tableId = currentTable.id || currentTable._id;
      dispatch(setTable({ number: currentTable.number, id: tableId }));
      
      // Fetch menu items
      dispatch(fetchCategories());
      dispatch(fetchMenuItems({ availability: true }));
    }
  }, [dispatch, currentTable]);

  const handleAddToCart = (menuItem) => {
    if (!currentTable) {
      toast.error('Table information not loaded');
      return;
    }
    dispatch(addToCart({ menuItem, quantity: 1 }));
    toast.success(`${menuItem.name} added to cart`);
  };

  const filteredItems = activeCategory
    ? items.filter((item) => item.categoryId?._id === activeCategory)
    : items;

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (tableLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading table information...</p>
        </div>
      </div>
    );
  }

  if (!currentTable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Table Not Found</h1>
          <p className="text-gray-600 mb-6">Invalid table QR code or table is inactive.</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Restaurant Menu</h1>
              <p className="text-sm text-gray-600">Table {currentTable.number} • {currentTable.location}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                Log in
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Cart ({cartCount})
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full transition ${
                activeCategory === null
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-50'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                className={`px-4 py-2 rounded-full transition ${
                  activeCategory === category._id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {menuLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuItem
                key={item._id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {filteredItems.length === 0 && !menuLoading && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No items found in this category</p>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default TableMenuPage;



