import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';
import Credito from './pages/Credito';
import Taller from './pages/Taller';
import Administracion from './pages/Administracion';
import Desempeno from './pages/Desempeno';
import Reportes from './pages/Reportes';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user);
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventario" element={<Inventory />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="credito" element={<Credito />} />
          <Route path="taller" element={<Taller />} />
          <Route path="administracion" element={<Administracion />} />
          <Route path="desempeno" element={<Desempeno />} />
          <Route path="reportes" element={<Reportes />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
