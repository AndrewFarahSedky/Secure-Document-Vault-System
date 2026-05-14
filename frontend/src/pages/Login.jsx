import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
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
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a' }}>
      <div className="card" style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Shield size={48} color="#3b82f6" style={{ marginBottom:12 }} />
          <h1 style={{ fontSize:28, fontWeight:700 }}>Secure Vault</h1>
          <p style={{ color:'#64748b', marginTop:8 }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button className="btn btn-primary" style={{ width:'100%', padding:12, fontSize:16 }}
            type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ margin:'20px 0', textAlign:'center', color:'#475569' }}>— or —</div>

        <a href="http://localhost:5000/api/auth/github"
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            padding:12, background:'#24292e', borderRadius:8, color:'white',
            textDecoration:'none', fontWeight:600, fontSize:14 }}>
          🐙 Continue with GitHub
        </a>

        <p style={{ textAlign:'center', marginTop:20, color:'#64748b', fontSize:14 }}>
          Don't have an account? <Link to="/register" style={{ color:'#3b82f6' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}