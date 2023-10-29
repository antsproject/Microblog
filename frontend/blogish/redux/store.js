import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import tokenReducer from './slices/tokenSlice';
import categoryReducer from './slices/categorySlice';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import {persistReducer, persistStore} from 'redux-persist';
import {combineReducers} from '@reduxjs/toolkit';
import postReducer from './slices/postSlice';
import favoriteReducer from './slices/favoriteSlice';
import likeReducer from './slices/likeSlice';

const persistConfig = {
    key: 'blogish',
    storage,
};

const rootReducer = combineReducers({
    user: userReducer,
    token: tokenReducer,
    post: postReducer,
    category: categoryReducer,
    favorite: favoriteReducer,
    like: likeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
});

export const persistor = persistStore(store);
