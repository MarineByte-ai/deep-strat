import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import IndustriesPage from './pages/IndustriesPage';
import SolutionsPage from './pages/SolutionsPage';
import ServicesPage from './pages/ServicesPage';
import CompanyPage from './pages/CompanyPage';
import IndustryDetailPage from './pages/IndustryDetailPage';
import SolutionDetailPage from './pages/SolutionDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/industries" element={<IndustriesPage />} />
      <Route path="/solutions" element={<SolutionsPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/company" element={<CompanyPage />} />
      <Route path="/industries/:industrySlug" element={<IndustryDetailPage />} />
      <Route path="/solutions/:solutionSlug" element={<SolutionDetailPage />} />
    </Routes>
  );
}

export default App;
