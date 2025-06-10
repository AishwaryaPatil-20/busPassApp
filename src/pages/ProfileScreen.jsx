import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./Profile.css";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem("profilePhoto");
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, []);

  return (
    <div className="profile-container">
      <Toaster position="top-right" />

      <header className="profile-header">
        <h1>My Profile</h1>
        <button
          className="update-btn"
          onClick={() => navigate("/update-profile")}
        >
          Click here to update your profile
        </button>
      </header>

      <div className="profile-photo-container">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            className="profile-photo"
          />
        ) : (
          <div className="default-profile-icon">
            <i className="fas fa-user-circle"></i>
          </div>
        )}
      </div>

      {/* Rest of your ProfileScreen content */}

    </div>
  );
};

export default ProfileScreen;
