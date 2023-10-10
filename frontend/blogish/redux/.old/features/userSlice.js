import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    token: null,
    user: null,
    // isLogged: false
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
    removeData: (state) => {
      state.data.token = null;
      state.data.user = null;
    },
    setUserAndToken: (state, action) => {
      if (action.payload.token != null && action.payload.user != null) {
        state.data.token = action.payload.token;
        state.data.user = action.payload.user;
      }
    }
    // setIsLogged: (state, action) => {
    //   state.data.isLogged = action.payload;
    // },
  },
});

export const { setUser, setToken, removeData, setUserAndToken } = userSlice.actions;

export default userSlice.reducer;
