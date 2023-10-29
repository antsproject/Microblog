import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: null };

export const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        setFavoriteSlice: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setFavoriteSlice } = favoriteSlice.actions;
export default favoriteSlice.reducer;
