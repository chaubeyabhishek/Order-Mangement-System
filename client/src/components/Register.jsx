import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

const Register = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await register({ name, email, password, role });
      localStorage.setItem('token', data.token);
      onRegister(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '60px 40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '40px', fontSize: '32px', fontWeight: 'bold', color: 'var(--text)' }}>Inventory & Order Management System</h2>
        <p style={{ marginBottom: '40px', lineHeight: '1.6', fontSize: '16px', color: 'var(--text)' }}>
          A comprehensive platform designed to streamline your inventory operations and order management workflows.
        </p>
        <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '60px', color: 'var(--text)' }}>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px', fontSize: '18px' }}>📦</span>
            Manage products with precision pricing and multiple units
          </li>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px', fontSize: '18px' }}>💰</span>
            INR pricing with high-precision decimal support
          </li>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px', fontSize: '18px' }}>📋</span>
            Request, approve, and manage orders effortlessly
          </li>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px', fontSize: '18px' }}>🔐</span>
            Role-based access control for admins and users
          </li>
        </ul>

        <div className="card" style={{ maxWidth: '400px', padding: '30px' }}>
          <h1 style={{ marginBottom: '8px' }}>Register</h1>
          <p style={{ marginBottom: '20px', color: 'var(--muted)' }}>Create an account with role-based access.</p>
          {error && <div className="alert" style={{ marginBottom: '20px' }}>{error}</div>}
          <form onSubmit={handleSubmit} className="grid auth-form">
            <input
              className="input"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn" type="submit" style={{ marginTop: '10px' }}>Register</button>
          </form>
          <p style={{ marginTop: '20px', fontSize: '14px' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
