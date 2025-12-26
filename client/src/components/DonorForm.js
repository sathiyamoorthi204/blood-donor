import React, { useState } from 'react';
import axios from 'axios';

const DonorForm = () => {
  const [formData, setFormData] = useState({ bloodType: '', location: '', phone: '' });

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/donors', formData);
      alert('Donor info added successfully');
    } catch (err) {
      console.error(err.response.data);
      alert('Failed to add donor info');
    }
  };

  return (
    <div>
      <h2>Add Donor Information</h2>
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
        <input name="phone" value={formData.phone} onChange={onChange} placeholder="Phone" required />
        <button type="submit">Add Info</button>
      </form>
    </div>
  );
};

export default DonorForm;