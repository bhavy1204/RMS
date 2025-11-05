import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuItems, fetchCategories } from '../store/slices/menuSlice';
import AdminNav from '../Components/utils/AdminNav';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../axios';

const AdminMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isLoading, categories } = useSelector((state) => state.menu);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    isAvailable: true,
    image: null,
  });

  useEffect(() => {
    dispatch(fetchMenuItems({}));
    dispatch(fetchCategories());
  }, [dispatch]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({ name: '', description: '', price: '', categoryId: categories[0]?._id || '', isAvailable: true, image: null });
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      categoryId: item.categoryId?._id || item.categoryId || '',
      isAvailable: item.isAvailable ?? true,
      image: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files && files[0] ? files[0] : null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', String(Number(form.price)));
      formData.append('categoryId', form.categoryId);
      formData.append('availability', String(!!form.isAvailable));
      if (form.image) formData.append('image', form.image);

      if (editingItem) {
        await api.put(`/api/menu/items/${editingItem._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Menu item updated');
      } else {
        await api.post('/api/menu/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Menu item created');
      }
      closeModal();
      dispatch(fetchMenuItems({}));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed');
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/api/menu/items/${id}`);
      toast.success('Menu item deleted');
      dispatch(fetchMenuItems({}));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Menu Items</h1>
            <button onClick={openCreate} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
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
                  <p className="text-orange-500 font-bold">&#8377;{item.price.toFixed(2)}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => openEdit(item)} className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition">
                      Edit
                    </button>
                    <button onClick={() => deleteItem(item._id)} className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Modal
            open={isModalOpen}
            title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            onClose={closeModal}
            onSubmit={submitForm}
            form={form}
            onChange={onChange}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;

// Modal
// Simple inline modal for create/edit
// Tailwind-based minimal modal
// Placed after default export intentionally for file locality
function Modal({ open, title, onClose, onSubmit, form, onChange, categories }) {
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
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input name="name" value={form.name} onChange={onChange} required className="mt-1 w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={form.description} onChange={onChange} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" step="0.01" name="price" value={form.price} onChange={onChange} required className="mt-1 w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="categoryId" value={form.categoryId} onChange={onChange} required className="mt-1 w-full border rounded-lg px-3 py-2">
                <option value="" disabled>Choose...</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input type="file" name="image" accept="image/*" onChange={onChange} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="flex items-center gap-2">
            <input id="isAvailable" type="checkbox" name="isAvailable" checked={!!form.isAvailable} onChange={onChange} />
            <label htmlFor="isAvailable" className="text-sm text-gray-700">Available</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}


