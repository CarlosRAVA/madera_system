import { Navigate, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}

export default App;
