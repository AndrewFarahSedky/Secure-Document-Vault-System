import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api';

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      API.get('/auth/me').then(({ data }) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      }).catch(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  }, [navigate, params]);

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <p>Authenticating...</p>
    </div>
  );
}