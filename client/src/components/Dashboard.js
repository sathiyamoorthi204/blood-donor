import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DonorForm from "./DonorForm";
import RequestForm from "./RequestForm";
import { AuthContext } from "../context/AuthContext";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({ donors: 0, requests: 0, units: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const donorRes = await axios.get("/donors/count");
        const requestRes = await axios.get("/requests");
        
        setStats({
          donors: donorRes.data.count || 0,
          requests: requestRes.data.length || 0,
          units: (requestRes.data.length * 2) || 0
        });
      } catch (err) {
        console.error("Error fetching stats:", err.message);
      }
    };

    fetchStats();
  }, []);

  if (!auth || !auth.user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="sidebar">

        <h2 className="logo">🩸 Blood Bank</h2>

        <div className="user-card">
          <h3>Welcome</h3>
          <p>{auth.user.name}</p>
          <span className="role">{auth.user.role}</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">
            🏠 Dashboard
          </Link>

          <Link to="/patient-detail" className="nav-link">
            🔍 Search Donors
          </Link>

          {auth.user.role === "requester" && (
            <Link to="/request-form" className="nav-link">
              📄 Request Blood
            </Link>
          )}

          {/* ✅ ADD THIS */}
          {auth.user.role === "donor" && (
            <Link to="/update-donor" className="nav-link">
              ✏️ Update Donor Info
            </Link>
          )}
          <Link to="/request-history" className="nav-link">
  📜 Request History
       </Link>

        </nav>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="subtitle">
            Blood Donation Management System
          </p>
        </header>

        {/* Stats Cards */}
        <div className="stats-container">

          <div className="stat-card">
            <h3>Total Donors</h3>
            <p>{stats.donors}</p>
          </div>

          <div className="stat-card">
            <h3>Blood Requests</h3>
            <p>{stats.requests}</p>
          </div>

          <div className="stat-card">
            <h3>Available Units</h3>
            <p>{stats.units}</p>
          </div>

        </div>

        {/* Form Section */}
        <section className="form-card">

          {auth.user.role === "donor" && (
            <>
              <h3>Add Donor Information</h3>
              <DonorForm />

            </>
          )}

          {auth.user.role === "requester" && (
            <>
              <h3>Request Blood</h3>
              <RequestForm />
            </>
          )}

        </section>

      </main>

    </div>
  );
};

export default Dashboard;
