import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PatientDetail from './components/PatientDetail';
import DonorList from './components/DonorList';
import './App.css';

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
            <Route path="/donor-list" element={<DonorList />} />
            <Route path="/" element={<div><h1>Home</h1><a href="/register">Register</a> | <a href="/login">Login</a></div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
