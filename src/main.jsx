/**
 * TaskFlow Frontend - Application Entry Point
 * 
 * This is the main entry file that initializes the React application.
 * It sets up Redux store, React Router, and initializes user state from localStorage.
 */

import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux' // Redux store provider for global state management
import { BrowserRouter } from 'react-router-dom' // Client-side routing
import { store } from './store/store' // Redux store configuration
import { loadUserFromStorage } from './store/slices/authSlice' // Action to restore user from localStorage
import './index.css' // Global styles and Tailwind CSS
import App from './App.jsx' // Main App component with route definitions

/**
 * Root Component
 * Wraps the entire application with necessary providers and initializes app state
 */
function Root() {
  useEffect(() => {
    // Restore user authentication state from localStorage on app load
    // This prevents logout on page refresh
    store.dispatch(loadUserFromStorage());
    
    // Apply dark mode theme from localStorage if previously set
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      document.documentElement.classList.add('dark'); // Tailwind dark mode class
    }
  }, []); // Run only once on component mount

  return (
    // Redux Provider - Makes the Redux store available to all nested components
    <Provider store={store}>
      {/* BrowserRouter - Enables client-side routing (no page reloads) */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}

// Render the application to the DOM
// StrictMode helps identify potential problems during development
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
