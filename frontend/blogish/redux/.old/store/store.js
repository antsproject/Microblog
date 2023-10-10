import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../features/userSlice';

// Импортируйте ваши срезы (reducers) здесь

const store = configureStore({
  reducer: {
    // Добавьте ваши срезы (reducers) сюда
    global: userSlice,
  },
});

export default store;
