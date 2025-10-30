import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../axios';

// Async thunks
export const fetchTableBySlug = createAsyncThunk(
  'tables/fetchTableBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/tables/by-slug/${slug}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const tableSlice = createSlice({
  name: 'tables',
  initialState: {
    currentTable: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTable: (state) => {
      state.currentTable = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTableBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTable = action.payload?.table || action.payload || null;
      })
      .addCase(fetchTableBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearTable } = tableSlice.actions;
export default tableSlice.reducer;



