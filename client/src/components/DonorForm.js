import React, { useState } from "react";
import axios from "axios";
import "../styles/DonorList.css";

const DonorForm = () => {

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    bloodType: "",
    phone: "",
    location: "",
    email: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post("/donors", formData);

      if (res && res.data) {
        alert("Donor Added Successfully");

        setFormData({
          name: "",
          gender: "",
          bloodType: "",
          phone: "",
          location: "",
          email: ""
        });
      }

    } catch (error) {
      console.error(error?.response?.data || error.message);
      alert("Error adding donor: " + (error?.response?.data?.msg || error.message));

    }

  };

  return (

    <div className="donor-form-container">

      <h2>Add Donor Information</h2>

      <form onSubmit={handleSubmit} className="donor-form">

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >

          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>

        </select>

        <select
          name="bloodType"
          value={formData.bloodType}
          onChange={handleChange}
          required
        >

          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>

        </select>

        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location / City"
          value={formData.location}
          onChange={handleChange}
          required
        />

       <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />


        <button type="submit" className="btn-submit">
          Add Donor
        </button>

      </form>

    </div>

  );

};

export default DonorForm;
