import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../store/slices/orderSlice';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

const Cart = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items, tableId, tableNumber } = useSelector((state) => state.cart);
  const { isLoading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Check if table is set (required for table orders)
    if (!tableId) {
      toast.error('No table selected');
      return;
    }

    const orderData = {
      tableId: tableId,
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        note: item.note,
        price: item.menuItem.price,
      })),
      subtotal: items.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0
      ),
      total: items.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0
      ),
    };

    try {
      await dispatch(createOrder(orderData));
      toast.success('Order placed successfully!');
      dispatch(clearCart());
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={onClose}
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-orange-500 text-white">
            <div>
              <h2 className="text-xl font-bold">Your Cart</h2>
              {tableNumber && (
                <p className="text-sm text-orange-100">Table {tableNumber}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-orange-600 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-24 h-24 mx-auto text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <p className="text-gray-600 mt-4">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((cartItem) => (
                  <div key={cartItem.menuItemId} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{cartItem.menuItem.name}</h4>
                        <p className="text-orange-500 font-bold">
                          ${cartItem.menuItem.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(cartItem.menuItemId))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(updateQuantity({ menuItemId: cartItem.menuItemId, quantity: Math.max(1, cartItem.quantity - 1) }))}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="font-semibold">{cartItem.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ menuItemId: cartItem.menuItemId, quantity: cartItem.quantity + 1 }))}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-xl font-bold text-orange-500">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;

