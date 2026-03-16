import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RequestHistory.css";

const RequestHistory = () => {

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/requests");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="request-history-container">

      <h2 className="request-history-title">
        Blood Request History
      </h2>

      <table className="request-history-table">

        <thead>
          <tr>
            <th>Requester Name</th>
            <th>Blood Type</th>
            <th>Hospital</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((req) => {

            const date = new Date(req.createdAt);

            return (
              <tr key={req._id}>
                <td>{req.requesterName}</td>
                <td>{req.bloodType}</td>
                <td>{req.hospitalName}</td>
                <td>{req.location}</td>
                <td>{date.toLocaleDateString()}</td>
                <td>{date.toLocaleTimeString()}</td>
              </tr>
            );
          })}
        </tbody>

      </table>

    </div>
  );
};

export default RequestHistory;
