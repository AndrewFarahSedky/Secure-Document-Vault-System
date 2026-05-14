import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Verify from './pages/Verify';
import AdminPanel from './pages/AdminPanel';
import OAuthSuccess from './pages/OAuthSuccess';
import TwoFA from './pages/TwoFA';

function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }
      }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/2fa" element={<TwoFA />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Navbar /><Dashboard /></PrivateRoute>
        } />
        <Route path="/documents" element={
          <PrivateRoute><Navbar /><Documents /></PrivateRoute>
        } />
        <Route path="/verify" element={
          <PrivateRoute><Navbar /><Verify /></PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute roles={['admin']}><Navbar /><AdminPanel /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}