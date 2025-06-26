import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !mobile.trim() || !aadhaar.trim()) {
      toast.error("Please fill all fields.");
      return;
    }
    if (!/^[0-9]{10}$/.test(mobile)) {
      toast.error("Invalid 10-digit mobile number.");
      return;
    }
    if (!/^[0-9]{12}$/.test(aadhaar)) {
      toast.error("Invalid 12-digit Aadhaar number.");
      return;
    }
    if (!photo) {
      toast.error("Please upload your ID photo.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("aadhaar", aadhaar);
    formData.append("photo", photo);

    try {
      await axios.post("http://localhost:5000/api/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
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

      <label htmlFor="photo-upload" className="photo-label">
        Upload ID Photo (Max 2MB)
      </label>
      <input
        type="file"
        id="photo-upload"
        accept="image/*"
        onChange={handlePhotoChange}
      />

      {photoPreview && (
        <div className="photo-preview">
          <img src={photoPreview} alt="Preview" />
        </div>
      )}

      <div className="buttons">
        <button onClick={handleSubmit}>Save</button>
        <button className="cancel-btn" onClick={() => navigate("/profile")}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateProfile;
