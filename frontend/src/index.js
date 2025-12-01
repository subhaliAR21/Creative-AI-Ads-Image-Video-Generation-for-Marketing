
// Date 11/12/2025
// ........................................................................................................................................................


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

document.body.style.margin = 0;
document.body.style.backgroundColor = '#f3f4f6';
document.body.style.fontFamily = 'Inter, sans-serif'; // Apply globally

root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);