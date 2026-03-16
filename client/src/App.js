import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PatientDetail from './components/PatientDetail';
import RequestForm from "./components/RequestForm";
import DonorList from './components/DonorList';
import './App.css';
import WelcomePage from './components/WelcomePage';
import UpdateDonor from "./components/UpdateDonor";
import RequestHistory from "./components/RequestHistory";


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patient-detail" element={<PatientDetail />} />
             <Route path="/Request-form" element={<RequestForm />} />
            <Route path="/donor-list" element={<DonorList />} />
            <Route path="/" element={<WelcomePage />} />
            <Route path="/update-donor" element={<UpdateDonor />} />
            <Route path="/request-history" element={<RequestHistory />} />


            {/* <Route path="/" element={<div className="page"><h1>Welcome to BloodDonor</h1><p className="muted">Quick links</p><div style={{display:'flex',gap:8}}><a className="btn" href="/register">Register</a><a className="btn ghost" href="/login">Login</a></div></div>} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
