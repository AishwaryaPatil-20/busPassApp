
import React, { useState, useEffect } from 'react';
import './Notification.css';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function Notification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const sampleNotifications = [
      {
        id: 1,
        message: '📅 Your Monthly Pass expires in 2 days.',
        timestamp: 'June 24, 2025',
      },
      {
        id: 2,
        message: '🚌 Route 5A is delayed by 10 minutes.',
        timestamp: 'June 23, 2025',
      },
      {
        id: 3,
        message: '🕒 New Timetable available for Route 2B.',
        timestamp: 'June 22, 2025',
      },
    ];

    setNotifications(sampleNotifications);
  }, []);

  return (
    <div className="notification-page">
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        <IoArrowBack size={20} /> 
      </button>

      <h2 className="notification-title">🔔 Notifications</h2>

      {notifications.length === 0 ? (
        <p className="no-notification">You have no new notifications.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((note) => (
            <li key={note.id} className="notification-item">
              <p>{note.message}</p>
              <span className="timestamp">{note.timestamp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
