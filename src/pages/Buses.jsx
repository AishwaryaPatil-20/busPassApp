import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61238.png",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export default function SimulatedBuses() {
  const navigate = useNavigate();
  const [positions, setPositions] = useState({});
  const [routes, setRoutes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/buses");
        setPositions(res.data.positions);
        setRoutes(res.data.routes);
      } catch (err) {
        console.error("Failed to fetch bus data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "600px", width: "100%", maxWidth: "900px", margin: "auto", marginTop: "20px" }}>
      <MapContainer center={[17.664, 75.893]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {Object.entries(positions).map(([busId, pos]) => (
          <Marker key={busId} position={pos} icon={busIcon}>
            <Popup>{busId} is here</Popup>
          </Marker>
        ))}

        {Object.entries(routes).map(([busId, route]) => (
          <Polyline key={busId} positions={route} color="blue" />
        ))}
      </MapContainer>

      <nav className="bottom-nav" style={{ display: "flex", justifyContent: "space-around", padding: "1rem", backgroundColor: "#f1f1f1" }}>
        <button className="nav-btn" onClick={() => navigate("/dashboard")}>Home</button>
        <button className="nav-btn" onClick={() => navigate("/buses")}>Buses</button>
        <button className="nav-btn" onClick={() => navigate("/help")}>Help</button>
      </nav>
    </div>
  );
}
