import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const DonorList = () => {
  const location = useLocation();
  const { name: patientName, hospital: hospitalName, location: searchLocation, bloodType, urgency = 'medium' } = location.state;
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    axios.get('/donors').then(res => {
      const filtered = res.data.filter(d => d.location === searchLocation && d.bloodType === bloodType);
      setDonors(filtered);
    }).catch(err => console.error(err));
  }, [searchLocation, bloodType]);
  
  const request = async (donorId) => {
    try {
      await axios.post('/requests', {
        donor: donorId,
        requesterName: patientName,
        bloodType,
        location: searchLocation,
        hospitalName,
        urgency
      });
      alert('Request sent to donor');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err.message || 'Failed to send request';
      alert(`Failed: ${msg}`);
    }
  };

  const requestAll = async () => {
    try {
      // Send a single request without a specific donor ID
      // The backend will now notify all donors matching the blood type and location
      await axios.post('/requests', {
        requesterName: patientName,
        bloodType,
        location: searchLocation,
        hospitalName,
        urgency
      });
      alert('Requests sent to all matching donors');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err.message || 'Failed to send requests';
      if (err?.response?.data?.missing) {
        alert(`Failed: ${msg} - missing: ${err.response.data.missing.join(', ')}`);
      } else {
        alert(`Failed: ${msg}`);
      }
    }
  };

  return (
    <div className="donor-list-wrapper">
      <div className="donor-list-header">
        <h2>Matching Donors</h2>
        <button className="btn request-all" onClick={requestAll}>Request All</button>
      </div>

      {donors.length === 0 ? (
        <p className="muted">No matching donors found.</p>
      ) : (
        <div className="donor-list">
          {donors.map(d => (
            <div key={d._id} className="donor-card">
              <h3 className="donor-name">{d.name}</h3>
              <p className="donor-email">Email: <span>{d.email && d.email !== 'N/A' ? d.email : 'N/A'}</span></p>
              <p className="donor-phone">Phone: <span>{d.phone || 'N/A'}</span></p>
              <p className="donor-blood">Blood Type: <span>{d.bloodType}</span></p>
              <div className="donor-actions">
                <button className="btn" onClick={() => request(d._id)}>Request</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorList;