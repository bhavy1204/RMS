import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../store/slices/orderSlice';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { useState } from 'react';
import api from '../../axios';
import { openInvoiceWindow } from './invoice';

const Cart = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items, tableId, tableNumber } = useSelector((state) => state.cart);
  const { isLoading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [paying, setPaying] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const handleCheckout = async ({ paid } = { paid: false }) => {
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

    if (paid) {
      orderData.paymentStatus = 'paid';
      orderData.paymentMethod = 'digital';
      orderData.specialInstructions = `Paid via Razorpay (Dummy) - TXN-${Math.random()
        .toString(36)
        .slice(2, 10)}`;
    }

    try {
      const res = await dispatch(createOrder(orderData)).unwrap();
      const created = res?.data?.order || res?.order || null;
      setInvoiceOrder(created);
      toast.success('Order placed successfully!');
      dispatch(clearCart());
      // Keep drawer open to show invoice modal below
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const startDummyRazorpay = async () => {
    setShowPayModal(true);
    setPaying(true);
    // Simulate a 2s payment processing
    setTimeout(async () => {
      setPaying(false);
      setShowPayModal(false);
      await handleCheckout({ paid: true });
    }, 2000);
  };

  const startRazorpay = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Razorpay SDK failed to load.');
      return;
    }

    try {
      const amount = total; // total in rupees
      const { data } = await api.post('api/payments/create-order', { amount });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Restaurant App',
        description: 'Order Payment',
        order_id: data.orderId,
        handler: async (response) => {
          const verifyRes = await api.post('/payments/verify', response);

          if (verifyRes.data.success) {
            await handleCheckout({ paid: true });
            toast.success('Payment successful!');
          } else {
            toast.error('Payment verification failed!');
          }
        },
        theme: { color: '#f97316' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      toast.error('Error initializing payment');
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
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
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
                  <path d="M7 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
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
                          <span>&#8377; </span>{cartItem.menuItem.price.toFixed(2)}
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
                  <span>&#8377; </span>{total.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleCheckout()}
                  disabled={isLoading}
                  className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
                >
                  {isLoading ? 'Placing…' : 'Place Order (Cash)'}
                </button>
                <button
                  onClick={startRazorpay}
                  disabled={isLoading || paying}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {paying ? 'Paying…' : 'Pay with Razorpay'}
                </button>
              </div>
              {invoiceOrder && (
                <div className="mt-4 p-3 bg-white border rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Order # {invoiceOrder.orderNumber}</div>
                      <div className="font-semibold">Bill ready</div>
                    </div>
                    <button
                      onClick={() => openInvoiceWindow(invoiceOrder)}
                      className="px-3 py-2 bg-black text-white rounded"
                    >
                      Download Bill
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Razorpay (Dummy)</h3>
            <p className="text-sm text-gray-600">Processing your payment…</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
            </div>
            <button
              onClick={() => setShowPayModal(false)}
              className="mt-6 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;

