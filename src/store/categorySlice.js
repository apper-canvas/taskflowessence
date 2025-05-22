import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  loading: false,
  error: null,
  selectedCategory: 'all'
};

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoriesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCategoriesError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(category => category.Id !== action.payload);
    }
  },
});

export const { setCategoriesLoading, setCategoriesSuccess, setCategoriesError, 
               addCategory, setSelectedCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;