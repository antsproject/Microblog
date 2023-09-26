import { configureStore } from '@reduxjs/toolkit';
// import tokenSlice from '../features/tokenSlice';
import userSlice from '../features/userSlice';

export const store = configureStore({
  reducer: {
    // token: tokenSlice,
    global: userSlice,
  },
});

// import axios from 'axios';
// import AuthService from '../services/AuthService';
// import { makeAutoObservable } from 'mobx';
// export default class Store {
//   user = {};
//   isAuth = false;

//   constructor() {
//     makeAutoObservable(this);
//   }

//   setAuth(bool) {
//     this.isAuth = bool;
//   }
//   setUser(user) {
//     this.user = user;
//   }

//   async login(email, password) {
//     try {
//       const response = await AuthService.login(email, password);
//       localStorage.setItem('token', response.data.accessToken);
//       this.setAuth(true);
//       this.setUser(response.data.user);
//       console.log(response);
//     } catch (event) {
//       console.log(event.response?.data?.message);
//     }
//   }
//   async registration(username, email, password1, password2) {
//     try {
//       const response = await AuthService.registration(username, email, password1, password2);
//       localStorage.setItem('token', response.data.accessToken);
//       this.setAuth(true);
//       this.setUser(response.data.user);
//       console.log(response);
//     } catch (event) {
//       console.log(event.response?.data?.message);
//     }
//   }

//   async logout() {
//     try {
//       const response = await AuthService.logout();
//       localStorage.removeItem('token');
//       this.setAuth(false);
//       this.setUser({});
//     } catch (event) {
//       console.log(event.response?.data?.message);
//     }
//   }

//   async checkAuth() {
//     try {
//       const response = await axios.get(`${API_URL}/refresh`, { withCredentials: true });
//     } catch (event) {
//       console.log(event.response?.data?.message);
//     }
//   }
// }
