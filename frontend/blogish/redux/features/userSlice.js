import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    token: '',
    user: '',
  },
};

export const userSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.data.user = action.payload;
    },
    setToken: (state, action) => {
      state.data.token = action.payload;
    },
  },
});

export const { setUser, setToken } = userSlice.actions;
export default userSlice.reducer;
