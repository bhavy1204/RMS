import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, fetchMenuItems } from '../store/slices/menuSlice';
import { addToCart } from '../store/slices/cartSlice';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import MenuItem from '../Components/utils/MenuItem';
import Cart from '../Components/utils/Cart';

const MenuPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, items, isLoading } = useSelector((state) => state.menu);
  const { items: cartItems } = useSelector((state) => state.cart);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchMenuItems({ availability: true }));
  }, [dispatch]);

  const handleAddToCart = (menuItem) => {
    dispatch(addToCart({ menuItem, quantity: 1 }));
    toast.success(`${menuItem.name} added to cart`);
  };

  const filteredItems = activeCategory
    ? items.filter((item) => item.categoryId?._id === activeCategory)
    : items;

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Restaurant Menu</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-orange-500 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h4a2 2 0 012 2v4m0 6v4a2 2 0 01-2 2h-4M9 21H5a2 2 0 01-2-2v-4m0-6V5a2 2 0 012-2h4m3 7a4 4 0 110-8 4 4 0 010 8zm0 0v5m0 0l-2-2m2 2l2-2" />
              </svg>
              Login
            </button>
            <button
              onClick={() => navigate('/scan')}
              className="text-gray-600 hover:text-orange-500 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0v.01M12 12h.01M12 18h.01M6 14h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Scan Table
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
            {Array.isArray(categories) &&
            categories.map((category) => (
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
        {isLoading ? (
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

        {filteredItems.length === 0 && !isLoading && (
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

export default MenuPage;

