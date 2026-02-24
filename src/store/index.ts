import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import localforage from 'localforage';
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import salesReducer from './slices/salesSlice';
import rootSaga from './rootSaga';

localforage.config({
  name: 'FleetSUNAT_DB',
  storeName: 'redux_state'
});

const persistConfig = {
  key: 'sunat-root',
  storage: localforage,
  whitelist: ['auth', 'sales'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  sales: salesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;