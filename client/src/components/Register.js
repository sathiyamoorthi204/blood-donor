import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'donor' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/register', formData);
      if (res && res.data && res.data.token && res.data.user) {
        login(res.data.token, res.data.user);
        navigate('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error(err?.response?.data || err.message);
      setError(err?.response?.data?.msg || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>Register as Blood Donor</h2>
            <p className="auth-subtitle">Join our blood donation network</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Create a password"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Register as</label>
              <select id="role" name="role" value={formData.role} onChange={onChange}>
                <option value="donor">Blood Donor</option>
                <option value="requester">Blood Requester</option>
              </select>
            </div>

            <button className="btn-primary full-width" type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'REGISTER AS DONOR'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <a href="/login">Login here</a></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;