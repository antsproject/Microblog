import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: null };

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
