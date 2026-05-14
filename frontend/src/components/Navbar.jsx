import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, FileText, CheckCircle, Users, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="navbar-brand">
          <Shield size={24} /> Secure Vault
        </div>
        <div className="navbar-links">
          <button className={isActive('/dashboard')} onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={16} style={{display:'inline', marginRight:4}} /> Dashboard
          </button>
          <button className={isActive('/documents')} onClick={() => navigate('/documents')}>
            <FileText size={16} style={{display:'inline', marginRight:4}} /> Documents
          </button>
          <button className={isActive('/verify')} onClick={() => navigate('/verify')}>
            <CheckCircle size={16} style={{display:'inline', marginRight:4}} /> Verify
          </button>
          {user?.role === 'admin' && (
            <button className={isActive('/admin')} onClick={() => navigate('/admin')}>
              <Users size={16} style={{display:'inline', marginRight:4}} /> Admin
            </button>
          )}
          <span style={{color:'#64748b', fontSize:13}}>
            {user?.username} <span className={`badge badge-${user?.role}`}>{user?.role}</span>
          </span>
          <button className="btn btn-danger" style={{padding:'6px 12px'}} onClick={logout}>
            <LogOut size={14} style={{display:'inline', marginRight:4}} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}