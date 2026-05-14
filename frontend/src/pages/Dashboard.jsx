import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, CheckCircle, Users, QrCode } from 'lucide-react';
import API from '../api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [show2FA, setShow2FA] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [twoFAToken, setTwoFAToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/documents').then(({ data }) => setDocs(data.documents)).catch(() => {});
    API.get('/auth/me').then(({ data }) => {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }).catch(() => {});
  }, []);

  const setup2FA = async () => {
    try {
      const { data } = await API.post('/auth/setup-2fa');
      setQrCode(data.qr);
      setShow2FA(true);
    } catch { toast.error('Failed to setup 2FA'); }
  };

  const enable2FA = async () => {
    try {
      await API.post('/auth/enable-2fa', { token: twoFAToken });
      toast.success('2FA enabled successfully!');
      setShow2FA(false);
      const { data } = await API.get('/auth/me');
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch { toast.error('Invalid code, try again'); }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Welcome back, {user?.username}! 👋</h1>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:32 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background:'#1e3a5f' }}><FileText color="#3b82f6" /></div>
            <div><div style={{ fontSize:28, fontWeight:700 }}>{docs.length}</div><div style={{ color:'#64748b' }}>Documents</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background:'#14532d44' }}><Shield color="#22c55e" /></div>
            <div><div style={{ fontSize:28, fontWeight:700 }}>AES-256</div><div style={{ color:'#64748b' }}>Encryption</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background:'#7c3aed22' }}><CheckCircle color="#a855f7" /></div>
            <div><div style={{ fontSize:28, fontWeight:700 }}>SHA-256</div><div style={{ color:'#64748b' }}>Integrity</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background:'#92400e22' }}><Users color="#f59e0b" /></div>
            <div>
              <div style={{ fontSize:18, fontWeight:700 }}>
                <span className={`badge badge-${user?.role}`}>{user?.role}</span>
              </div>
              <div style={{ color:'#64748b' }}>Your Role</div>
            </div>
          </div>
        </div>

        {/* 2FA Setup */}
        <div className="card" style={{ marginBottom:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <h3 style={{ marginBottom:4 }}>Two-Factor Authentication</h3>
              <p style={{ color:'#64748b', fontSize:14 }}>
                Status: {user?.two_factor_enabled
                  ? <span style={{ color:'#22c55e' }}>✅ Enabled</span>
                  : <span style={{ color:'#ef4444' }}>❌ Disabled</span>}
              </p>
            </div>
            {!user?.two_factor_enabled && (
              <button className="btn btn-primary" onClick={setup2FA}>
                <QrCode size={16} style={{ display:'inline', marginRight:6 }} /> Enable 2FA
              </button>
            )}
          </div>

          {show2FA && (
            <div style={{ marginTop:20, padding:20, background:'#0f172a', borderRadius:8 }}>
              <p style={{ marginBottom:12, color:'#94a3b8' }}>Scan this QR code with Google Authenticator:</p>
              <img src={qrCode} alt="QR Code" style={{ display:'block', margin:'0 auto 16px', borderRadius:8 }} />
              <div style={{ display:'flex', gap:8, maxWidth:300, margin:'0 auto' }}>
                <input className="input" type="text" placeholder="Enter 6-digit code"
                  value={twoFAToken} onChange={e => setTwoFAToken(e.target.value)} maxLength={6} />
                <button className="btn btn-success" onClick={enable2FA}>Verify</button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 style={{ marginBottom:16 }}>Quick Actions</h3>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/documents')}>
              📤 Upload Document
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/verify')}>
              🔍 Verify Document
            </button>
            {user?.role === 'admin' && (
              <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
                👥 Manage Users
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}