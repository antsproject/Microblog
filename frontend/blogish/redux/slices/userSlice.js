import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: null };

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.value = action.payload;
		},
		setAvatar: (state, action) => {
			state.value.avatar = action.payload;
		}
	},
});

export const { setUser, setAvatar } = userSlice.actions;
export default userSlice.reducer;
