import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/PatientDetail.css";

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
    <div className="patient-page">
      <div className="patient-form-card">
        <h2>Patient Details</h2>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <label>
              <span className="label-text">Patient Name</span>
              <input name="name" value={formData.name} onChange={onChange} placeholder="e.g. John Doe" required />
            </label>

            <label>
              <span className="label-text">Contact Number</span>
              <input name="contact" type="tel" value={formData.contact} onChange={onChange} placeholder="e.g. +1234567890" required />
            </label>
          </div>

          <div className="form-row">
            <label>
              <span className="label-text">Hospital</span>
              <input name="hospital" value={formData.hospital} onChange={onChange} placeholder="Hospital Name" required />
            </label>

            <label>
              <span className="label-text">Location</span>
              <input name="location" value={formData.location} onChange={onChange} placeholder="City or address" required />
            </label>
          </div>

          <label>
            <span className="label-text">Blood Type</span>
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
          </label>

          <label>
            <span className="label-text">Blood Units Needed</span>
            <input name="bloodUnit" type="number" min="1" value={formData.bloodUnit} onChange={onChange} placeholder="1" required />
          </label>

          <button type="submit">Search Donors</button>
        </form>
      </div>
    </div>
  );
};

export default PatientDetail;