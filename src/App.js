import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatUI from './components/ChatUI';
import Players from './components/Players';
import Navbar from './components/Navbar'; // Import Navbar
import './App.css'; // Import global styles

function App() {
  return (
    <Router>
      {/* Include Navbar here if it's meant to be present on all pages */}
      <Navbar />
      <Routes>
        <Route path="/" element={<ChatUI />} />
        <Route path="/chatui" element={<ChatUI />} />
        <Route path="/players" element={<Players />} />
      </Routes>
    </Router>
  );
}

export default App;
