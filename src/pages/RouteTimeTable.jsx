import React, { useEffect, useState } from "react";
import axios from "axios";
import './RouteTimeTable.css';
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function RouteTimeTable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/timetable/solapur-bus-timetable");
        setTimetable(res.data.timetable);
        setLoading(false);
      } catch (err) {
        setError("Failed to load timetable");
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) return <p>Loading timetable...</p>;
  if (error) return <p>{error}</p>;


  const filteredTimetable = timetable.filter((item) =>
    item.routeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="timetable-wrapper">
      <button
        className="back-button"
        onClick={() => navigate("/dashboard")}
        aria-label="Go back"
      >
        <IoArrowBack size={20} />
      </button>
      <h2>Solapur Bus Timetable</h2>

   
      <input
        type="text"
        placeholder="search bus route"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {filteredTimetable.length === 0 ? (
        <p>No buses found for "{searchTerm}".</p>
      ) : (
        <ul>
          {filteredTimetable.map((item, index) => (
            <li key={index} className="timetable-item">
              <strong>{item.routeName}</strong>
              <br />
              <span>Timings: {item.times.join(", ")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
