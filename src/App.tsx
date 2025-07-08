import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuditProvider } from './context/AuditContext';
import Header from './components/Header';
import Home from './pages/Home';
import Audit from './pages/Audit';
import Learn from './pages/Learn';
import Gallery from './pages/Gallery';

function App() {
  return (
    <AuditProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </div>
      </Router>
    </AuditProvider>
  );
}

export default App;