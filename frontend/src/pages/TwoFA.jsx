import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      toast.success('2FA verified successfully!');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid 2FA code. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 32px rgba(139,92,246,0.35)'
          }}>
            <span style={{ fontSize: 36 }}>🛡️</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
            Two-Factor Authentication
          </h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <div style={{
          background: '#1e293b',
          borderRadius: 20,
          padding: 32,
          border: '1px solid #334155',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
        }}>
          <div style={{
            padding: '16px',
            background: 'rgba(139,92,246,0.1)',
            borderRadius: 12,
            border: '1px solid rgba(139,92,246,0.2)',
            marginBottom: 24,
            textAlign: 'center'
          }}>
            <p style={{ color: '#c4b5fd', fontSize: 14, fontWeight: 500 }}>
              📱 Open Google Authenticator and enter the code shown for <strong>Secure Vault</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" style={{ textAlign: 'center', display: 'block' }}>
                Authentication Code
              </label>
              <input
                className="input"
                type="text"
                placeholder="0 0 0 0 0 0"
                maxLength={6}
                value={token}
                onChange={e => setToken(e.target.value.replace(/\D/g, ''))}
                style={{
                  textAlign: 'center',
                  fontSize: 32,
                  fontWeight: 700,
                  letterSpacing: 16,
                  padding: '16px',
                  color: '#f1f5f9'
                }}
                required
              />
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: 16 }}
              type="submit"
              disabled={loading || token.length < 6}
            >
              {loading ? '⏳ Verifying...' : '✅ Verify Code'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}