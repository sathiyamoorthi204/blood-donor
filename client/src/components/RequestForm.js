import React, { useState } from 'react';
import axios from 'axios';

const RequestForm = () => {
  const [formData, setFormData] = useState({ bloodType: '', location: '', urgency: 'medium' });

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/requests', formData);
      alert('Blood request posted successfully');
    } catch (err) {
      console.error(err.response.data);
      alert('Failed to post request');
    }
  };

  return (
    <div>
      <h2>Post Blood Request</h2>
      <form onSubmit={onSubmit}>
        <select name="bloodType" value={formData.bloodType} onChange={onChange} required>
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        <input name="location" value={formData.location} onChange={onChange} placeholder="Location" required />
        <select name="urgency" value={formData.urgency} onChange={onChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Post Request</button>
      </form>
    </div>
  );
};

export default RequestForm;