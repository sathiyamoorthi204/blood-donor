import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'donor' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input name="name" value={formData.name} onChange={onChange} placeholder="Name" required />
        <input name="email" value={formData.email} onChange={onChange} placeholder="Email" required />
        <input name="password" value={formData.password} onChange={onChange} placeholder="Password" type="password" required />
        <select name="role" value={formData.role} onChange={onChange}>
          <option value="donor">Donor</option>
          <option value="requester">Requester</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;