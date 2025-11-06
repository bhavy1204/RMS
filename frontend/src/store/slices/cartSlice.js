import { createSlice } from '@reduxjs/toolkit';

// Load persisted table selection from localStorage
const persistedTable = (() => {
  try {
    const raw = localStorage.getItem('cartTable');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
})();

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    tableNumber: persistedTable?.tableNumber || null,
    tableId: persistedTable?.tableId || null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { menuItem, quantity } = action.payload;
      const existingItem = state.items.find(item => item.menuItemId === menuItem._id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          menuItemId: menuItem._id,
          menuItem,
          quantity,
          note: '',
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.menuItemId !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { menuItemId, quantity } = action.payload;
      const item = state.items.find(item => item.menuItemId === menuItemId);
      if (item) {
        item.quantity = quantity;
      }
    },
    updateNote: (state, action) => {
      const { menuItemId, note } = action.payload;
      const item = state.items.find(item => item.menuItemId === menuItemId);
      if (item) {
        item.note = note;
      }
    },
    setTable: (state, action) => {
      state.tableNumber = action.payload.number;
      state.tableId = action.payload.id;
      try {
        localStorage.setItem(
          'cartTable',
          JSON.stringify({ tableNumber: state.tableNumber, tableId: state.tableId })
        );
      } catch (_) {}
    },
    clearTable: (state) => {
      state.tableNumber = null;
      state.tableId = null;
      try {
        localStorage.removeItem('cartTable');
      } catch (_) {}
    },
    clearCart: (state) => {
      // Only clear items; keep table selection for subsequent orders
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, updateNote, setTable, clearTable, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

