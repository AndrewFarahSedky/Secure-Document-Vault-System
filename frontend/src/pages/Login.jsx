import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      if (data.requires2FA) {
        localStorage.setItem('temp_userId', data.userId);
        navigate('/2fa');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 32px rgba(59,130,246,0.35)'
          }}>
            <span style={{ fontSize: 36 }}>🔐</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#f1f5f9', marginBottom: 8, letterSpacing: '-0.5px' }}>
            Secure Vault
          </h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#1e293b',
          borderRadius: 20,
          padding: 32,
          border: '1px solid #334155',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
        }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">📧 Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="label">🔑 Password</label>
              <input
                className="input"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: 16, marginTop: 4 }}
              type="submit"
              disabled={loading}
            >
              {loading ? '⏳ Signing in...' : '🚀 Sign In'}
            </button>
          </form>

          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: '#334155' }} />
            <span style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: '#334155' }} />
          </div>

          <a href="https://localhost:5000/api/auth/github" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '13px', background: '#24292e',
            border: '1px solid #444d56',
            borderRadius: 10, color: 'white',
            textDecoration: 'none', fontWeight: 600, fontSize: 15,
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: 20 }}>🐙</span> Continue with GitHub
          </a>

          <p style={{ textAlign: 'center', marginTop: 24, color: '#64748b', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#3b82f6', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}