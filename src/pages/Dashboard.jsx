import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FaTicketAlt,
  FaUserAlt,
  FaBell,
  FaSearch,
  FaBus,
  FaRoute,
  FaQuestionCircle,
  FaUserCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Dashboard.css";

// Default bus icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [nearbyBuses, setNearbyBuses] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingBuses, setLoadingBuses] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in first.");
          return navigate("/");
        }
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported.");
      setLoadingBuses(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        try {
          const res = await axios.get(
            `http://localhost:5000/api/buslocation/nearby?lat=${latitude}&lng=${longitude}`
          );
          setNearbyBuses(res.data);
        } catch (err) {
          toast.error("Failed to fetch nearby buses.");
        }
        setLoadingBuses(false);
      },
      () => {
        toast.error("Location access denied.");
        setLoadingBuses(false);
      }
    );
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    navigate("/");
  };

  if (!user) return <p className="dashboard-loading">Loading dashboard...</p>;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <FaBus className="bus-icon" />
        <div className="dashboard-header-icons">
          <FaBell />
          <FaUserCircle
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}
            title="View Profile"
          />
        </div>
      </div>

      <div className="dashboard-search">
        <FaSearch />
        <input type="text" placeholder="कुठे जायचे आहे?" />
      </div>

      <div className="dashboard-tiles">
        <div className="tile" onClick={() => navigate("/ticket-details")}>
          <FaTicketAlt /> <span>Bus Ticket</span>
        </div>
        <div className="tile" onClick={() => navigate("/daily-pass")}>
          <FaUserAlt /> <span>Daily Pass</span>
        </div>
        <div className="tile" onClick={() => navigate("/view-tickets")}>
          <FaTicketAlt /> <span>View Ticket</span>
        </div>
        <div className="tile" onClick={() => navigate("/viewpass")}>
          <FaTicketAlt /> <span>View Pass</span>
        </div>
        <div className="tile" onClick={() => navigate("/routetimetable")}>
          <FaRoute /> <span>Route Timetable</span>
        </div>
      </div>

      <div className="dashboard-notice">
        <p>
          <b>i</b> सोलापुर महानगर परिवहन महामंडळ लि. दिनांक 1 जून पासून तिकीट आणि पासच्या दरात नाममात्र वाढ केली आहे, तरी आपले सहकार्य असेच राहू द्या धन्यवाद!
        </p>
      </div>

      <div className="dashboard-nearme">
        <div className="near-header">
          <h3>
            <FaMapMarkerAlt /> Near Me
          </h3>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/buses")}>
            Show all
          </span>
        </div>

        {loadingBuses ? (
          <div className="near-card">
            <p>Fetching nearby buses...</p>
          </div>
        ) : nearbyBuses.length === 0 ? (
          <div className="near-card">
            <p>No buses found nearby.</p>
          </div>
        ) : (
          nearbyBuses.map((bus, idx) => (
            <div key={idx} className="near-card">
              <FaBus className="bus-icon" />
              <p>
                <b>Route:</b> {bus.route}
              </p>
              <p>
                <b>Distance:</b> {(bus.distance / 1000).toFixed(2)} km
              </p>
            </div>
          ))
        )}
      </div>

      {/* Real-Time Map */}
      {userLocation && (
        <div style={{ height: "300px", margin: "1rem", borderRadius: "10px", overflow: "hidden" }}>
          <MapContainer center={userLocation} zoom={14} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
            {nearbyBuses.map((bus, idx) => (
              <Marker key={idx} position={[bus.lat, bus.lng]}>
                <Popup>Route: {bus.route}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      <button onClick={handleLogout} className="dashboard-logout">
        Logout
      </button>

      <div className="dashboard-bottom-nav">
        <div className="nav-item active">
          <FaBus />
          <span>Home</span>
        </div>
        <div className="nav-item" onClick={() => navigate("/buses")}>
          <FaRoute />
          <span>Buses</span>
        </div>
        <div className="nav-item">
          <FaQuestionCircle />
          <span>Help</span>
        </div>
      </div>
    </div>
  );
}
