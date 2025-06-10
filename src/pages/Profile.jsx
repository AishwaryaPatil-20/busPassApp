import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./Profile.css";

const ProfileScreen = () => {
  const navigate = useNavigate();

 
  const [showComplaint, setShowComplaint] = useState(false);
  const [complaintText, setComplaintText] = useState("");

  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  const handleComplaintSubmit = () => {
    if (complaintText.trim() === "") {
      toast.error("Please enter your complaint.");
      return;
    }
    toast.success("Complaint submitted: " + complaintText);
    setComplaintText("");
    setShowComplaint(false);
  };

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    toast.success(`Thank you for rating us ${rating} star${rating > 1 ? "s" : ""}!`);
    setRating(0);
    setShowRating(false);
  };

  return (
    <div className="profile-container">
  
      <Toaster position="top-right" />

      <header className="profile-header">
        <h1>My Profile</h1>
        <button
  className="update-btn"
  onClick={() => navigate("/update-profile")}
>
  Update Profile
</button>

      </header>

      <main className="profile-main">
        <div className="menu-card">
          <button className="menu-item" onClick={() => navigate("/view-tickets")}>
            My Tickets
          </button>
          <button className="menu-item" onClick={() => navigate("/viewpass")}>
            My Passes
          </button>
          <button
            className="menu-item"
            onClick={() => {
              setShowComplaint(!showComplaint);
              setShowRating(false);
            }}
          >
            Complaints
          </button>
          <button
            className="menu-item"
            onClick={() => {
              setShowRating(!showRating);
              setShowComplaint(false);
            }}
          >
            <span>Rate Us</span>
            <span className="stars">*****</span>
          </button>
        </div>

        {showComplaint && (
          <div className="complaint-form">
            <h3>Submit your complaint</h3>
            <textarea
              rows="4"
              placeholder="Write your complaint here..."
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
            />
            <button onClick={handleComplaintSubmit}>Submit Complaint</button>
          </div>
        )}

        {showRating && (
          <div className="rating-form">
            <h3>Rate our service</h3>
            <div className="stars-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: "2rem",
                    cursor: "pointer",
                    color: star <= rating ? "gold" : "lightgray",
                  }}
                  onClick={() => setRating(star)}
                  role="button"
                  aria-label={`${star} star`}
                >
                  ★
                </span>
              ))}
            </div>
            <button onClick={handleRatingSubmit}>Submit Rating</button>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button className="nav-btn" onClick={() => navigate("/dashboard")}>Home</button>
        <button className="nav-btn" onClick={() => navigate("/buses")} >Buses</button>
        <button className="nav-btn">Help</button>
      </nav>
    </div>
  );
};

export default ProfileScreen;
