import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/outfit/300.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/900.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
