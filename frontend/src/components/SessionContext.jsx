// src/SessionContext.jsx
import React from 'react';
import { createContext, useState, useContext } from 'react';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [history, setHistory] = useState([]);

  const addToHistory = (original, mask) => {
    setHistory(prev => [...prev, { original, mask }]);
  };

  return (
    <SessionContext.Provider value={{ history, addToHistory }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
