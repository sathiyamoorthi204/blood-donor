import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientDetail = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    hospital: '',
    location: '',
    bloodType: '',
    bloodUnit: ''
  });
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    navigate('/donor-list', { state: formData });
  };

  return (
    <div>
      <h2>Patient Details</h2>
      <form onSubmit={onSubmit}>
        <input name="name" value={formData.name} onChange={onChange} placeholder="Patient Name" required />
        <input name="contact" value={formData.contact} onChange={onChange} placeholder="Contact Number" required />
        <input name="hospital" value={formData.hospital} onChange={onChange} placeholder="Hospital Name" required />
        <input name="location" value={formData.location} onChange={onChange} placeholder="Location" required />
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
        <input name="bloodUnit" type="number" value={formData.bloodUnit} onChange={onChange} placeholder="Blood Units Needed" required />
        <button type="submit">Search Donors</button>
      </form>
    </div>
  );
};

export default PatientDetail;