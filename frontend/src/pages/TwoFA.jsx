import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import API from '../api';
import toast from 'react-hot-toast';

export default function TwoFA() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = localStorage.getItem('temp_userId');
      const { data } = await API.post('/auth/verify-2fa', { userId, token });
      localStorage.removeItem('temp_userId');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('2FA verified!');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid 2FA code');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a' }}>
      <div className="card" style={{ width:'100%', maxWidth:380 }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <Shield size={48} color="#3b82f6" />
          <h2 style={{ marginTop:12 }}>Two-Factor Authentication</h2>
          <p style={{ color:'#64748b', marginTop:8, fontSize:14 }}>Enter the 6-digit code from your authenticator app</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input className="input" type="text" placeholder="000000" maxLength={6}
              value={token} onChange={e => setToken(e.target.value)}
              style={{ textAlign:'center', fontSize:24, letterSpacing:8 }} required />
          </div>
          <button className="btn btn-primary" style={{ width:'100%', padding:12 }}
            type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
}