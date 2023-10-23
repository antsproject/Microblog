import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: null, // Для хранения access токена
    refreshToken: null, // Для хранения refresh токена
};

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.value = action.payload;
        },
        setRefreshToken: (state, action) => {
            state.refreshToken = action.payload;
        },
    },
});

export const { setToken, setRefreshToken } = tokenSlice.actions;
export default tokenSlice.reducer;
