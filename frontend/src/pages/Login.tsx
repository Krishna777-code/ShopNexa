import React, { useState } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="glass-panel auth-card">
      <h2 className="page-title" style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', width: '100%' }}>Welcome Back</h2>
      {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(248, 81, 73, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Email Address</label>
          <input 
            type="email" 
            className="input-field" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@example.com"
            required 
          />
        </div>
        
        <div className="input-group">
          <label className="input-label">Password</label>
          <input 
            type="password" 
            className="input-field" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            required 
          />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>
          Sign In
        </button>
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
