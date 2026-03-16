import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UpdateDonor.css";

const UpdateDonor = () => {
  const [formData, setFormData] = useState({
    bloodType: "",
    location: "",
    phone: ""
  });

  useEffect(() => {
    // Fetch existing donor info
    axios.get("/api/donors/me")
      .then(res => {
        setFormData(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put("/api/donors/update", formData);
      alert("Donor info updated successfully");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Update Donor Information</h2>

      <form onSubmit={onSubmit}>
        <select
          name="bloodType"
          value={formData.bloodType}
          onChange={onChange}
          required
        >
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

        <input
          name="location"
          value={formData.location}
          onChange={onChange}
          placeholder="Location"
          required
        />

        <input
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="Phone"
          required
        />
       

        <button type="submit">Update Info</button>
      </form>
    </div>
  );
};

export default UpdateDonor;
