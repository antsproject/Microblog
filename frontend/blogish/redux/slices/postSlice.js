import { createSlice } from '@reduxjs/toolkit';

const initialState = { commentsCount: 0, likes: 0, username: '' };

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setCommentsCount: (state, action) => {
            state.commentsCount = action.payload;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
    },
});

export const { setCommentsCount, setUsername } = postSlice.actions;
export default postSlice.reducer;
