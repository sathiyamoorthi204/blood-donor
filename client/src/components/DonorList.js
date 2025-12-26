import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const DonorList = () => {
  const location = useLocation();
  const { location: searchLocation, bloodType } = location.state;
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/donors').then(res => {
      const filtered = res.data.filter(d => d.location === searchLocation && d.bloodType === bloodType);
      setDonors(filtered);
    }).catch(err => console.error(err));
  }, [searchLocation, bloodType]);

  const request = async (donorId) => {
    try {
      await axios.post('http://localhost:5000/api/requests', {
        donor: donorId,
        bloodType,
        location: searchLocation,
        urgency: 'medium'
      });
      alert('Request sent to donor');
    } catch (err) {
      alert('Failed to send request');
    }
  };

  const requestAll = async () => {
    try {
      await axios.post('http://localhost:5000/api/requests/request-all', {
        bloodType,
        location: searchLocation
      });
      alert('Requests sent to all matching donors');
    } catch (err) {
      alert('Failed to send requests');
    }
  };

  return (
    <div>
      <h2>Matching Donors</h2>
      <button onClick={requestAll}>Request All</button>
      {donors.map(d => (
        <div key={d._id}>
          <p>Name: {d.user.name}</p>
          <p>Email: {d.user.email}</p>
          <p>Phone: {d.phone}</p>
          <button onClick={() => request(d._id)}>Request</button>
        </div>
      ))}
    </div>
  );
};

export default DonorList;