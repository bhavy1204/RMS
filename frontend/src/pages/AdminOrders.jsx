import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../store/slices/orderSlice';
import AdminNav from '../Components/utils/AdminNav';
import toast from 'react-hot-toast';
import api from '../axios';
import { openInvoiceWindow } from '../Components/utils/invoice';
import { io } from 'socket.io-client';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { myOrders, isLoading } = useSelector((state) => state.orders);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // For admin/staff view, fetch all orders
    const load = async () => {
      try {
        const res = await api.get('/api/orders');
        setOrders(res.data.data.orders || res.data.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || 'Failed to load orders');
      }
    };
    load();
  }, []);

  // Socket subscription for live updates
  useEffect(() => {
    // derive socket URL from axios baseURL
    const base = (api?.defaults?.baseURL || '').replace(/\/$/, '');
    if (!base) return;
    const socket = io(base, {
      transports: ['websocket'],
      withCredentials: true,
    });

    const handleRefresh = async () => {
      try {
        const res = await api.get('/api/orders');
        setOrders(res.data.data.orders || res.data.data || []);
      } catch (_) {}
    };

    socket.on('order:new', handleRefresh);
    socket.on('order:updated', handleRefresh);

    return () => {
      socket.off('order:new', handleRefresh);
      socket.off('order:updated', handleRefresh);
      socket.close();
    };
  }, []);

  const refresh = async () => {
    try {
      const res = await api.get('/api/orders');
      setOrders(res.data.data.orders || res.data.data || []);
    } catch {}
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status });
      toast.success('Status updated');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      served: 'bg-gray-100 text-gray-800',
      canceled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-gray-600">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.tableId?.number || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        &#8377;{order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <select
                            className="ml-2 border rounded px-2 py-1 text-xs"
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                          >
                            <option value="placed">placed</option>
                            <option value="preparing">preparing</option>
                            <option value="ready">ready</option>
                            <option value="served">served</option>
                            <option value="canceled">canceled</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openInvoiceWindow(order)}
                            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            Download Bill
                          </button>
                          {order.paymentStatus !== 'paid' && (
                            <button
                              onClick={async () => {
                                try {
                                  await api.patch(`/api/orders/${order._id}/payment`, { paymentStatus: 'paid', paymentMethod: 'cash' });
                                  toast.success('Marked as paid');
                                  refresh();
                                } catch (err) {
                                  toast.error(err.response?.data?.message || err.message || 'Failed');
                                }
                              }}
                              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                            >
                              Mark Paid (Cash)
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

