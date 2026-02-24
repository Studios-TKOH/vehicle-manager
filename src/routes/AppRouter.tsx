import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Home />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};