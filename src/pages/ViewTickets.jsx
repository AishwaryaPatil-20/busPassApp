import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewTickets.css";

export default function ViewTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all booked tickets
    const fetchTickets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tickets");
        setTickets(res.data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="container">
      <h2>Booked Tickets</h2>
      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p>No tickets booked yet.</p>
      ) : (
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Full</th>
              <th>Half</th>
              <th>Distance (km)</th>
              <th>Fare (₹)</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={index}>
                <td>{ticket.startStop}</td>
                <td>{ticket.endStop}</td>
                <td>{ticket.fullTickets}</td>
                <td>{ticket.halfTickets}</td>
                <td>{ticket.distance.toFixed(2)}</td>
                <td>{ticket.totalFare.toFixed(2)}</td>
                <td>{ticket.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
