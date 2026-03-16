
import { useNavigate } from "react-router-dom";
import "../styles/WelcomePage.css";

const Home= () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      <h1 className="home-title">
        Welcome to Geospatial Blood Donor Identification and Alert System
      </h1>

      {/* Main Image */}
      <div className="image-container">
        <img
          src="/bloodimage.png"
          alt="Blood Donation"
          className="main-image"
        />
      </div>

      {/* Buttons */}
      <div className="button-container">
        <button
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          className="register-btn"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>

      {/* Feature Images */}
      <div className="features-container">
        <img src="/Quickalert.png" alt="Quick Alert" />
        <img src="/Fastresponse.png" alt="Fast Response" />
        <img src="/emergency.png" alt="Emergency" />
      </div>

    </div>
  );
};

export default Home;
