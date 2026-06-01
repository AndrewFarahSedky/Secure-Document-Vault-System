import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
            Create Account
          </h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>Join Secure Vault today</p>
        </div>

        <div style={{
          background: '#1e293b',
          borderRadius: 20,
          padding: 32,
          border: '1px solid #334155',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
        }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">👤 Username</label>
              <input
                className="input"
                type="text"
                placeholder="johndoe"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
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
                placeholder="Min 8 chars, upper, lower, number, symbol"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <div style={{
                marginTop: 10,
                padding: '10px 14px',
                background: 'rgba(59,130,246,0.08)',
                borderRadius: 8,
                border: '1px solid rgba(59,130,246,0.2)'
              }}>
                <p style={{ fontSize: 12, color: '#93c5fd', marginBottom: 4, fontWeight: 600 }}>Password must contain:</p>
                <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
                  ✓ At least 8 characters &nbsp;
                  ✓ Uppercase letter &nbsp;
                  ✓ Lowercase letter &nbsp;
                  ✓ Number &nbsp;
                  ✓ Special character (@$!%*?&)
                </p>
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: 16, marginTop: 4 }}
              type="submit"
              disabled={loading}
            >
              {loading ? '⏳ Creating...' : '✨ Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: '#64748b', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}