import React, { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoArrowBack } from "react-icons/io5";
import "./TicketDetails.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function TicketDetails() {
  const navigate = useNavigate();
  const [startStop, setStartStop] = useState("");
  const [endStop, setEndStop] = useState("");
  const [fullTickets, setFullTickets] = useState(1);
  const [halfTickets, setHalfTickets] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [startLatLon, setStartLatLon] = useState(null);
  const [endLatLon, setEndLatLon] = useState(null);
  const [email, setEmail] = useState("");

  const farePerKm = 5;

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: {
                format: "json",
                lat: latitude,
                lon: longitude,
              },
            }
          );
          const displayName = res.data.display_name || "";
          setStartStop(displayName);
          setStartLatLon({ lat: latitude, lon: longitude });
          toast.success("Current location set as starting stop!");
        } catch (error) {
          console.error(error);
          toast.error("Failed to get address from location.");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error(error);
        toast.error("Permission denied or unable to get location.");
        setLocationLoading(false);
      }
    );
  };

  const geocodeAddress = async (address) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: address,
          format: "json",
          limit: 1,
        },
      });
      if (res.data.length > 0) {
        const place = res.data[0];
        return { lat: parseFloat(place.lat), lon: parseFloat(place.lon) };
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleEndStopBlur = async () => {
    if (endStop.trim() === "") {
      setEndLatLon(null);
      return;
    }
    const coords = await geocodeAddress(endStop);
    if (coords) {
      setEndLatLon(coords);
    } else {
      toast.error("Invalid ending stop address.");
      setEndLatLon(null);
    }
  };

  const handlePayment = async () => {
    if (!startStop || !endStop || !email) {
      toast.error("Please fill all required fields including email.");
      return;
    }
    if (!startLatLon) {
      toast.error("Starting stop location not set.");
      return;
    }
    if (!endLatLon) {
      toast.error("Ending stop location not set or invalid.");
      return;
    }

    const distance = getDistanceFromLatLonInKm(
      startLatLon.lat,
      startLatLon.lon,
      endLatLon.lat,
      endLatLon.lon
    );

    if (distance <= 0) {
      toast.error("Invalid distance calculated.");
      return;
    }

    const totalTickets = fullTickets + halfTickets * 0.5;
    const totalFare = distance * farePerKm * totalTickets;

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/tickets", {
        startStop,
        endStop,
        fullTickets,
        halfTickets,
        distance,
        totalFare,
        paymentMethod: "Online",
        email
      });

      toast.success(`Ticket booked! Email sent to ${email}`);

      setStartStop("");
      setEndStop("");
      setEmail("");
      setFullTickets(1);
      setHalfTickets(0);
      setStartLatLon(null);
      setEndLatLon(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to book ticket. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button
        className="back-button"
        onClick={() => navigate("/dashboard")}
        aria-label="Go back"
      >
        <IoArrowBack size={20} />
      </button>

      <h2>Book Ticket</h2>

      <input
        className="input"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          className="input"
          type="text"
          placeholder="Enter starting stop"
          value={startStop}
          onChange={(e) => setStartStop(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          className="location-button"
          onClick={useCurrentLocation}
          disabled={locationLoading || loading}
        >
          {locationLoading ? (
            <>
              <ImSpinner2 className="spin" /> Loading...
            </>
          ) : (
            "📍 Use My Location"
          )}
        </button>
      </div>

      <input
        className="input"
        type="text"
        placeholder="Enter ending stop"
        value={endStop}
        onChange={(e) => setEndStop(e.target.value)}
        onBlur={handleEndStopBlur}
        disabled={loading}
      />

      <div className="ticket-row">
        <span>Full</span>
        <div className="counter">
          <button onClick={() => setFullTickets(Math.max(fullTickets - 1, 0))} disabled={loading}>-</button>
          <span>{fullTickets}</span>
          <button onClick={() => setFullTickets(fullTickets + 1)} disabled={loading}>+</button>
        </div>
      </div>

      <div className="ticket-row">
        <span>Half</span>
        <div className="counter">
          <button onClick={() => setHalfTickets(Math.max(halfTickets - 1, 0))} disabled={loading}>-</button>
          <span>{halfTickets}</span>
          <button onClick={() => setHalfTickets(halfTickets + 1)} disabled={loading}>+</button>
        </div>
      </div>

      <button
        className="pay-button"
        onClick={handlePayment}
        disabled={loading || locationLoading}
      >
        {loading ? <><ImSpinner2 className="spin" /> Processing...</> : "Pay & Book Ticket"}
      </button>
    </div>
  );
} 
