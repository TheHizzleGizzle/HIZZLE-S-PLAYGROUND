/**
 * Redux Store Configuration
 * Central state management for the application
 */

import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import battleReducer from './slices/battleSlice';
import editorReducer from './slices/editorSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    battle: battleReducer,
    editor: editorReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
