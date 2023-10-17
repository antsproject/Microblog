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
		},
		setUsername: (state, action) => {
			state.value.username = action.payload;
		},
		setIsSuperuser: (state, action) => {
			state.value.is_superuser = action.payload;
		},
		setIsStaff: (state, action) => {
			state.value.is_staff = action.payload;
		},
		setIsActive: (state, action) => {
			state.value.is_active = action.payload;
		},
	},
});

export const { setUser, setAvatar, setUsername, setIsSuperuser, setIsStaff, setIsActive } = userSlice.actions;
export default userSlice.reducer;
