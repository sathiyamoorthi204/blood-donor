import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DonorForm from './DonorForm';
import RequestForm from './RequestForm';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {auth.user?.name} ({auth.user?.role})</p>
      {auth.user?.role === 'donor' && <DonorForm />}
      {auth.user?.role === 'requester' && (
        <div>
          <RequestForm />
          <Link to="/patient-detail">Search for Donors</Link>
        </div>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;