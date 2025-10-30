import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AdminNav from '../Components/utils/AdminNav';
import toast from 'react-hot-toast';
import api from '../axios';

const AdminTables = () => {
  const dispatch = useDispatch();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qrMap, setQrMap] = useState({}); // tableId -> dataURL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ number: '', capacity: 2, location: 'Main Dining' });

  const loadTables = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/tables');
      const list = res.data.data.tables || [];
      setTables(list);
      // Generate QR per table (works for both active/inactive via individual endpoint)
      const entries = await Promise.all(
        list.map(async (t) => {
          try {
            const qrRes = await api.get(`/api/tables/${t._id}/qr`);
            return [t._id, qrRes.data.data.qrCode];
          } catch {
            return [t._id, null];
          }
        })
      );
      const map = Object.fromEntries(entries);
      setQrMap(map);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    setForm({ number: '', capacity: 2, location: 'Main Dining' });
    setIsModalOpen(true);
  };
  const openEdit = (t) => {
    setEditing(t);
    setForm({ number: t.number, capacity: t.capacity, location: t.location });
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === 'capacity' ? Number(value) : value }));
  };
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/api/tables/${editing._id}`, form);
        toast.success('Table updated');
      } else {
        await api.post('/api/tables', form);
        toast.success('Table created');
      }
      closeModal();
      loadTables();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/api/tables/${id}/toggle-status`);
      toast.success('Status changed');
      loadTables();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed');
    }
  };
  const removeTable = async (id) => {
    if (!confirm('Delete this table?')) return;
    try {
      await api.delete(`/api/tables/${id}`);
      toast.success('Table deleted');
      loadTables();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Tables Management</h1>
            <button onClick={openCreate} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Add Table</button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : tables.length === 0 ? (
            <p className="text-gray-600">No tables found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((t) => (
                <div key={t._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{t.number}</h3>
                      <p className="text-sm text-gray-600">Capacity: {t.capacity}</p>
                      <p className="text-sm text-gray-600">Location: {t.location}</p>
                      <p className={`mt-1 inline-block text-xs px-2 py-0.5 rounded ${t.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                        {t.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    {qrMap[t._id] ? (
                      <img src={qrMap[t._id]} alt={`QR ${t.number}`} className="w-24 h-24 object-contain border rounded" />
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center text-xs text-gray-400 border rounded">No QR</div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => openEdit(t)} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Edit</button>
                    <button onClick={() => toggleStatus(t._id)} className="flex-1 bg-amber-600 text-white py-2 rounded hover:bg-amber-700">{t.isActive ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={() => removeTable(t._id)} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TablesModal
        open={isModalOpen}
        title={editing ? 'Edit Table' : 'Add Table'}
        form={form}
        onChange={onChange}
        onClose={closeModal}
        onSubmit={submitForm}
      />
    </div>
  );
};

export default AdminTables;

function TablesModal({ open, title, form, onChange, onClose, onSubmit }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Table Number</label>
            <input name="number" value={form.number} onChange={onChange} required className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="T1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input type="number" min="1" name="capacity" value={form.capacity} onChange={onChange} required className="mt-1 w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <select name="location" value={form.location} onChange={onChange} className="mt-1 w-full border rounded-lg px-3 py-2">
                <option>Main Dining</option>
                <option>Patio</option>
                <option>VIP Room</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

