import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import './App.css';

// Páginas placeholder — se implementarán en sus respectivos issues
function HomePage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Bienvenido a Leños Rellenos 🪵</h1>
    </main>
  );
}
function LoginPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Login</h1>
    </main>
  );
}
function RegistroPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Registro</h1>
    </main>
  );
}
function CuentaPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Mi Cuenta</h1>
    </main>
  );
}
function MenuPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Menú</h1>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* Navbar global — muestra Login/Registro o Mi cuenta/Logout según sesión */}
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/cuenta" element={<CuentaPage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
