import { createSlice } from '@reduxjs/toolkit';

const initialState = { commentsCount: 0, likes: 0, username: '', postId: 0 };

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
        setPostId: (state, action) => {
            state.postId = action.payload;
        },
    },
});

export const { setCommentsCount, setUsername, setPostId } = postSlice.actions;
export default postSlice.reducer;
