import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './App.css';
import {BrowserRouter} from 'react-router-dom'; 
import { SessionProvider } from './components/SessionContext.jsx'; // ✅

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionProvider> {/* ✅ Wrap your app */}
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </SessionProvider>
  </React.StrictMode>
);
