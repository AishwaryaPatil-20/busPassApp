import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { useNavigate } from "react-router-dom"; // ✅ Added this
import './Buses.css';


// Custom bus icon
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61238.png",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const stops = [
  { id: 1, name: "Stop 1", position: [18.516726, 73.856255] },
  { id: 2, name: "Stop 2", position: [18.5204, 73.8567] },
  { id: 3, name: "Stop 3", position: [18.525, 73.86] },
  { id: 4, name: "Stop 4", position: [18.53, 73.865] },
];

export default function Buses() {
  const navigate = useNavigate(); // ✅ For navigation
  const [busPosition, setBusPosition] = useState(stops[0].position);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);

  // Move bus every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStopIndex((prev) => {
        const nextIndex = (prev + 1) % stops.length;
        setBusPosition(stops[nextIndex].position);
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "600px", width: "100%", maxWidth: "900px", margin: "auto", marginTop: "20px" }}>
      <MapContainer center={busPosition} zoom={15} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Bus Stops */}
        {stops.map((stop) => (
          <Marker key={stop.id} position={stop.position}>
            <Popup>{stop.name}</Popup>
          </Marker>
        ))}

        {/* Moving Bus Marker */}
        <Marker position={busPosition} icon={busIcon}>
          <Popup>Bus is here: {stops[currentStopIndex].name}</Popup>
        </Marker>

        {/* Route Line */}
        <Polyline positions={stops.map(s => s.position)} color="blue" />
      </MapContainer>

      {/* Bottom Navigation */}
      <nav className="bottom-nav" style={{ display: "flex", justifyContent: "space-around", padding: "1rem", backgroundColor: "#f1f1f1" }}>
        <button className="nav-btn" onClick={() => navigate("/dashboard")}>Home</button>
        <button className="nav-btn" onClick={() => navigate("/buses")}>Buses</button>
        <button className="nav-btn" onClick={() => navigate("/help")}>Help</button>
      </nav>
    </div>
  );
}
