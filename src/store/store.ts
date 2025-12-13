// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import queryReducer from './querySlice';
import schemaReducer from './schemaSlice';

export const store = configureStore({
  reducer: {
    query: queryReducer,
    schema: schemaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
