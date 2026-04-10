//region imports
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import playerReducer from './slices/playerSlice';
import uiReducer from './slices/uiSlice';
//endregion

//region configuration
/**
 * Redux persist configuration
 * Persists auth, player, and ui state across page refreshes
 */
const persistConfig = {
  key: 'muzly-root',
  storage,
  whitelist: ['auth', 'player', 'ui'], // Persist all slices
};
//endregion

//region reducers
/**
 * Root reducer combining all slices
 */
const rootReducer = combineReducers({
  auth: authReducer,
  player: playerReducer,
  ui: uiReducer,
});

/**
 * Persisted reducer with configuration
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);
//endregion

//region store
/**
 * Redux store configuration
 * Includes redux-persist middleware
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

/**
 * Redux persistor for state persistence
 */
export const persistor = persistStore(store);
//endregion

//region types
/**
 * Root state type derived from store
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * App dispatch type for typed dispatch
 */
export type AppDispatch = typeof store.dispatch;
//endregion
