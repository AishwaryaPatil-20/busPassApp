import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast"; // ✅ Import toast
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      toast.success("🎉 Registered successfully!"); // ✅ Toast message
    } catch (err) {
      toast.error(err.response?.data?.msg || "❌ Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Register</h2>
        <input
          placeholder="Name"
          type="text"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            to="/"
            style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
