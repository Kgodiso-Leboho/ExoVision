import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import ExoVision from './pages/Exovision';
import PredictPage from './pages/PredictPage';
import DatasetPage from './pages/DatasetPage';
import ModelInfoPage from './pages/ModelInfoPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/exovision" element={<ExoVision />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/dataset" element={<DatasetPage />} />
          <Route path="/model-info" element={<ModelInfoPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;