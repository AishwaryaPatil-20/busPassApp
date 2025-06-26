import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './ViewPass.css';
import { IoArrowBack } from "react-icons/io5";
export default function ViewPass() {
  const [email, setEmail] = useState('');
  const [passes, setPasses] = useState([]);
  const navigate = useNavigate();

  const fetchPasses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/pass/${email}`);
      setPasses(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch passes');
    }
  };

  return (
    <div className="view-pass-container">
      <button
        className="back-button"
        onClick={() => navigate("/dashboard")}
        aria-label="Go back"
      >
        <IoArrowBack size={20} />
      </button>
      <h2>🧾 View Your Smart Bus Pass</h2>
    
      <input
        type="email"
        placeholder="Enter your Gmail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />
      <button onClick={fetchPasses} className="view-button">Fetch My Passes</button>

      {passes.length > 0 ? (
        <div className="pass-list">
          {passes.map((pass, index) => (
            <div key={index} className="pass-card">
              <h3>🚌 Smart Bus Pass Details</h3>
              <p>Thank you for purchasing a <strong>{pass.passType}</strong> bus pass for the zone <strong>{pass.zoneType}</strong>.</p>
              <p><b>Pass ID (Last digits):</b> {pass.idDigits}</p>
              <p><b>Fare:</b> ₹{parseFloat(pass.fare).toFixed(2)}</p>
              <p><b>City:</b> {pass.city}</p>
              <p><b>Date:</b> {new Date(pass.createdAt).toLocaleString('en-IN')}</p>
              <p><b>Email:</b> {pass.email}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="note">No passes found yet</p>
      )}
    </div>
  );
}
