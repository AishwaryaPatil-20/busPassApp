// src/pages/Help.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Help.css';
import { IoArrowBack } from "react-icons/io5";

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="help-container">
      <button className="help-back" onClick={() => navigate("/dashboard")}>
        <IoArrowBack /> Back
      </button>
      <h2>🆘 Need Help?</h2>
      <ul className="help-list">
        <li>🚌 To book a pass, select pass type and zone, then pay.</li>
        <li>📧 Use a valid Gmail ID to receive your pass via email.</li>
        <li>🔢 Enter last 4 digits of Aadhar/PAN for ID verification.</li>
        <li>💳 All payments are securely processed via Razorpay.</li>
        <li>📞 Contact:8329613178 <b>smartbusspass3@gmail.com</b> for any issues.</li>
      </ul>
    </div>
  );
}
