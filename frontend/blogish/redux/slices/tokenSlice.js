import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;
