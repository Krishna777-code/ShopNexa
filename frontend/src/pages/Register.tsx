import React, { useState } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="glass-panel auth-card" style={{ maxWidth: '450px' }}>
      <h2 className="page-title" style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', width: '100%' }}>Create Account</h2>
      {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(248, 81, 73, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Full Name</label>
          <input 
            type="text" 
            className="input-field" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="John Doe"
            required 
          />
        </div>

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
            minLength={6}
          />
        </div>

        <div className="input-group">
          <label className="input-label">I want to...</label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" value="buyer" checked={role === 'buyer'} onChange={(e) => setRole(e.target.value)} />
              Buy Products
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" value="vendor" checked={role === 'vendor'} onChange={(e) => setRole(e.target.value)} />
              Sell Products
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" value="admin" checked={role === 'admin'} onChange={(e) => setRole(e.target.value)} />
              Admin
            </label>
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>
          Create Account
        </button>
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>Sign in</Link>
      </div>
    </div>
  );
};

export default Register;
