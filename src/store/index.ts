import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import localforage from 'localforage';

import rootSaga from './rootSaga';
import authReducer from './slices/authSlice';
import salesReducer from './slices/salesSlice';

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
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;