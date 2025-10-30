import { useState } from 'react';
import toast from 'react-hot-toast';

const MenuItem = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (!item.availability) {
      toast.error('This item is currently unavailable');
      return;
    }
    onAddToCart(item, quantity);
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
      <div className="relative h-48 bg-gray-200">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {!item.availability && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <span className="text-orange-500 font-bold text-lg">
            <span>&#8377; </span>{item.price.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        <div className="flex gap-2 flex-wrap mb-3">
          {item.isVegetarian && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              Vegetarian
            </span>
          )}
          {item.isVegan && (
            <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">
              Vegan
            </span>
          )}
          {item.isGlutenFree && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              Gluten Free
            </span>
          )}
        </div>

        {item.availability && (
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItem;





