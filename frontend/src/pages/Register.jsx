import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import API from '../api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ username:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a' }}>
      <div className="card" style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Shield size={48} color="#3b82f6" style={{ marginBottom:12 }} />
          <h1 style={{ fontSize:28, fontWeight:700 }}>Create Account</h1>
          <p style={{ color:'#64748b', marginTop:8 }}>Join Secure Vault today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Username</label>
            <input className="input" type="text" placeholder="johndoe"
              value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Min 8 chars, upper, lower, number, symbol"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <p style={{ fontSize:12, color:'#64748b', marginTop:6 }}>
              Must contain: uppercase, lowercase, number, special character (@$!%*?&)
            </p>
          </div>
          <button className="btn btn-primary" style={{ width:'100%', padding:12, fontSize:16 }}
            type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:20, color:'#64748b', fontSize:14 }}>
          Already have an account? <Link to="/login" style={{ color:'#3b82f6' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}