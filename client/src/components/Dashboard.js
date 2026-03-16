import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DonorForm from "./DonorForm";
import RequestForm from "./RequestForm";
import { AuthContext } from "../context/AuthContext";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);

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
            <p>120</p>
          </div>

          <div className="stat-card">
            <h3>Blood Requests</h3>
            <p>45</p>
          </div>

          <div className="stat-card">
            <h3>Available Units</h3>
            <p>78</p>
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
