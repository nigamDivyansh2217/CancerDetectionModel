
import React from 'react';
import Home from './Home.jsx';
import HistoryPage from './HistoryPage.jsx';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  );
}

export default App;
