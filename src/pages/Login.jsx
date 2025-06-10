import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; 
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();  // Add this

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      toast.success("✅ Logged in successfully!");
      navigate("/dashboard");  // Redirect after login success
    } catch (err) {
      toast.error(err.response?.data?.msg || "❌ Login failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Login</h2>
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
        <button type="submit">Login</button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
