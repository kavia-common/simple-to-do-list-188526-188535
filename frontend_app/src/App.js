import React from 'react';
import './App.css';
import './index.css';
import './assets/styles/theme.css';
import TodoApp from './components/TodoApp';

/**
 * Root application component that renders the TodoApp within a full-height app shell.
 * Provides overall layout container and theme variables from CSS.
 */
// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app-root">
      <TodoApp />
    </div>
  );
}

export default App;
