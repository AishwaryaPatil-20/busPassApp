import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [photo, setPhoto] = useState(null);  // store file object
  const [photoPreview, setPhotoPreview] = useState(null); // for preview

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !aadhaar.trim()
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    // Simple mobile number validation (10 digits)
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Simple Aadhaar validation (12 digits)
    if (!/^\d{12}$/.test(aadhaar)) {
      toast.error("Please enter a valid 12-digit Aadhaar number.");
      return;
    }

    if (!photo) {
      toast.error("Please upload your ID photo.");
      return;
    }

    toast.success("Profile updated successfully!");
    // Here you can add API call to save profile info + photo upload

    setTimeout(() => {
      navigate("/profile");
    }, 1500);
  };

  return (
    <div className="update-profile-container">
      <Toaster position="top-right" />
      <h2>Update Profile</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Mobile Number (10 digits)"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        maxLength={10}
      />
      <input
        type="text"
        placeholder="Aadhaar Card Number (12 digits)"
        value={aadhaar}
        onChange={(e) => setAadhaar(e.target.value)}
        maxLength={12}
      />
      <div>
        <label htmlFor="photo-upload" className="photo-label">
          Upload ID Photo (Max size 2MB)
        </label>
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          onChange={handlePhotoChange}
        />
        {photoPreview && (
          <div className="photo-preview">
            <img src={photoPreview} alt="ID Preview" />
          </div>
        )}
      </div>
      <div className="buttons">
        <button onClick={handleSubmit}>Save</button>
        <button className="cancel-btn" onClick={() => navigate("/profile")}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;
