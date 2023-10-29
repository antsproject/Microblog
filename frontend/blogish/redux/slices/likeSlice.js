import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: null };

export const likeSlice = createSlice({
    name: 'like',
    initialState,
    reducers: {
        setLikeSlice: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setLikeSlice } = likeSlice.actions;
export default likeSlice.reducer;
