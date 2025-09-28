import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DiaryListPage from '@/pages/DiaryListPage';
import CreateDiaryPage from '@/pages/CreateDiaryPage';
import DiaryDetailPage from '@/pages/DiaryDetailPage';
import EditDiaryPage from '@/pages/EditDiaryPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DiaryListPage />} />
        <Route path="/create" element={<CreateDiaryPage />} />
        <Route path="/diary/:id" element={<DiaryDetailPage />} />
        <Route path="/edit/:id" element={<EditDiaryPage />} />
      </Routes>
    </Router>
  );
};

export default App;