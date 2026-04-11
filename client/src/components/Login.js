import React, { useState, useContext } from 'react';
import axios from 'axios';
import "../styles/Login.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', formData);
      if (!res || !res.data || !res.data.token || !res.data.user) {
        throw new Error('Invalid response from server');
      }
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.msg || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>Login</h2>
            <p className="auth-subtitle">Access your blood donor account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Enter your email"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button className="btn-primary full-width" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <a href="/register">Register here</a></p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Login;
