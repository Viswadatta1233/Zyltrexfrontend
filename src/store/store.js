/**
 * Redux Store Configuration
 * 
 * Centralized state management store using Redux Toolkit.
 * This store combines all Redux slices (reducers) into a single state tree:
 * 
 * - auth: User authentication state (user info, token, isAuthenticated)
 * - tasks: Task management state (tasks list, filters, sorting, pagination)
 * - theme: UI theme state (dark mode toggle)
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Authentication state slice
import tasksReducer from './slices/tasksSlice'; // Tasks state slice
import themeReducer from './slices/themeSlice'; // Theme/dark mode state slice

/**
 * Redux Store
 * Configured with Redux Toolkit's configureStore which includes:
 * - Redux DevTools integration (in development)
 * - Default middleware (thunk, immutability checks, etc.)
 * - Automatic reducer combination
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,    // State path: state.auth
    tasks: tasksReducer,  // State path: state.tasks
    theme: themeReducer,  // State path: state.theme
  },
});

