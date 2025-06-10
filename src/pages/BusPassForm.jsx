import { useState } from "react";
import "./BusPassForm.css";
import axios from "axios";
import { toast } from "react-hot-toast";


export default function BusPassForm() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    address: "",
    passType: "new",
    validity: "6 months",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5000/api/buspass/apply", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Bus pass application submitted!");
      // optionally reset form
    } catch (err) {
      toast.error(err.response?.data?.msg || "Submission failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
      <input type="date" name="dob" onChange={handleChange} required />
      <textarea name="address" placeholder="Address" onChange={handleChange} required />
      
      <select name="passType" value={form.passType} onChange={handleChange}>
        <option value="new">New Pass</option>
        <option value="renewal">Renew Pass</option>
      </select>
      
      <select name="validity" value={form.validity} onChange={handleChange}>
        <option value="1 day">1 Day</option>
        <option value="1 months">1 Month</option>
        <option value="3 month">3 Month</option>
        <option value="6 months">6 Months</option>
        <option value="1 year">1 Year</option>
      </select>

      <button type="submit">Apply</button>
    </form>
  );
}
