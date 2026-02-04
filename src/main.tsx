import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import './styles/globals.css';

// Initialize dark mode from system preference
const initDarkMode = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', prefersDark);
};

initDarkMode();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
