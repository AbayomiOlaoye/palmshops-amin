import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/authSlice';
import farmReducer from './features/farmSlice';
import harvestedReducer from './features/harvestSlice';
// import notifReducer from './features/notifSlice';
import productReducer from './features/productSlice';
// import cartReducer from './features/cartSlice';
import orderReducer from './features/orderSlice';
// import navigationReducer from './features/navigationSlice';
// import summaryReducer from './features/summarySlice';
import courseReducer from './features/courseSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  farm: farmReducer,
  harvest: harvestedReducer,
  // notif: notifReducer,
  product: productReducer,
  // cart: cartReducer,
  orders: orderReducer,
  // navigation: navigationReducer,
  // summary: summaryReducer,
  courses: courseReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      ignoredPaths: ['harvest.error', 'payload.headers', 'meta.requestId', 'farm.error'],
    },
  }),
});

export const persistor = persistStore(store);
