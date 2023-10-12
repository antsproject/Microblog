import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import tokenReducer from './slices/tokenSlice';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import postReducer from './slices/postSlice';

const persistConfig = {
    key: 'blogish',
    storage,
};

const rootReducer = combineReducers({
    user: userReducer,
    token: tokenReducer,
    post: postReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
});

export const persistor = persistStore(store);
