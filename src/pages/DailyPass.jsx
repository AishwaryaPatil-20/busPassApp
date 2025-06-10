import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DailyPass.css';

export default function DailyPass() {
  const [passType, setPassType] = useState('Daily');
  const [zoneType, setZoneType] = useState('Solapur');
  const [idDigits, setIdDigits] = useState('');
  const [email, setEmail] = useState('');
  const [fare, setFare] = useState(70.83);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setCurrentDate(`${formattedDate} | ${formattedTime}`);
  }, []);

  const passTypes = {
    Daily: 70.83,
    Monthly: 500.00,
    "6-Month": 2500.00
  };

  const handlePassTypeChange = (type) => {
    setPassType(type);
    setFare(passTypes[type]);
  };

  const handleZoneChange = (zone) => {
    setZoneType(zone);
  };

  const validateEmail = (email) => {
    return /^[\w.+\-]+@gmail\.com$/.test(email);
  };

  const handleSubmit = async () => {
    if (idDigits.length !== 4) {
      alert('Please enter last 4 digits of your ID');
      return;
    }
    if (!validateEmail(email)) {
      alert('Please enter a valid Gmail address (e.g., example@gmail.com)');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/pass', {
        passType,
        zoneType,
        idDigits,
        email,
        fare,
        city: 'Solapur'
      });
      alert(`${passType} pass for ${zoneType} successfully generated and sent to your Gmail!`);
    } catch (error) {
      console.error(error);
      alert('Failed to generate pass');
    }
  };

  return (
    <div className="daily-pass-container">
      <h2 className="title">🚌 Smart Bus Pass - Solapur</h2>
      <p className="date">{currentDate}</p>

      <div className="section">
        <label className="label">Select Pass Duration</label>
        <div className="pass-type-buttons">
          {Object.keys(passTypes).map((type) => (
            <button
              key={type}
              onClick={() => handlePassTypeChange(type)}
              className={`pass-button ${passType === type ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <label className="label">Select Zone Type</label>
        <button
          onClick={() => handleZoneChange('Solapur')}
          className={`zone-button ${zoneType === 'Solapur' ? 'active' : ''}`}
        >
          Solapur Bus Pass - ₹70.0
        </button>
        <button
          onClick={() => handleZoneChange('All_Route')}
          className={`zone-button ${zoneType === 'All_Route' ? 'active' : ''}`}
        >
          All Route - ₹150.0
        </button>
        <p className="note">Valid only on Solapur city routes</p>
      </div>

      <div className="section">
        <label className="label">Last 4 digits of your Aadhar/PAN</label>
        <input
          type="text"
          maxLength={4}
          value={idDigits}
          onChange={(e) => setIdDigits(e.target.value)}
          className="input"
        />
        <p className="note">You must carry a valid ID with the same details.</p>
      </div>

      <div className="section">
        <label className="label">Email ID</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="example@gmail.com"
        />
        <p className="note">Only Gmail addresses are accepted. Your pass will be emailed here.</p>
      </div>

      <div className="fare">
        <span className="fare-label">Total Fare:</span>
        <span className="fare-value">₹{fare.toFixed(2)}</span>
      </div>

      <button
        onClick={handleSubmit}
        className="submit-button"
      >
        Pay ₹{fare.toFixed(2)}
      </button>
    </div>
  );
}
