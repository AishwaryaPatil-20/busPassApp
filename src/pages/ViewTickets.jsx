import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";
import "./ViewTickets.css";

export default function ViewTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tickets");
        setTickets(res.data);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Unable to load tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="container1">
      {/* Back Button */}
      <button
              className="back-button"
              onClick={() => navigate("/dashboard")}
              aria-label="Go back"
            >
              <IoArrowBack size={20} />
      </button>

      <h2>Booked Tickets</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : tickets.length === 0 ? (
        <p>No tickets booked yet.</p>
      ) : (
        <table className="ticket-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Start</th>
              <th>End</th>
              <th>Full</th>
              <th>Half</th>
              <th>Distance (km)</th>
              <th>Fare (₹)</th>
              <th>Payment</th>
              <th>Booked At</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{ticket.startStop}</td>
                <td>{ticket.endStop}</td>
                <td>{ticket.fullTickets}</td>
                <td>{ticket.halfTickets}</td>
                <td>{ticket.distance ? ticket.distance.toFixed(2) : "—"}</td>
                <td>{ticket.totalFare ? ticket.totalFare.toFixed(2) : "—"}</td>
                <td>{ticket.paymentMethod}</td>
                <td>{new Date(ticket.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
