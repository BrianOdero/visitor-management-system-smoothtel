import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VisitorForm } from './pages/VisitorForm';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VisitorForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;