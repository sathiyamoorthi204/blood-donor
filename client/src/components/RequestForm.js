import React, { useState } from 'react';
import axios from 'axios';

import "../styles/RequestForm.css";

const RequestForm = () => {
  const [formData, setFormData] = useState({ 
    requesterName: '', 
    requesterEmail: '',
    bloodType: '', 
    hospitalName: '', 
    location: '', 
    urgency: 'medium' 
  });

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/requests', formData);
      if (res && res.data) {
        alert('Blood request posted successfully');
        setFormData({ requesterName: '', requesterEmail: '', bloodType: '', hospitalName: '', location: '', urgency: 'medium' });
      } else {
        alert('Unexpected response from server');
      }
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert('Failed to post request: ' + (err?.response?.data?.msg || err.message));
    }
  };

  return (
    <div>
      <h2>Post Blood Request</h2>
      <form onSubmit={onSubmit}>
        <input name="requesterName" value={formData.requesterName} onChange={onChange} placeholder="Requester Name" required />
        <input name="requesterEmail" value={formData.requesterEmail} onChange={onChange} placeholder="Requester Email" type="email" required />
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
        <input name="hospitalName" value={formData.hospitalName} onChange={onChange} placeholder="Hospital Name" required />
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