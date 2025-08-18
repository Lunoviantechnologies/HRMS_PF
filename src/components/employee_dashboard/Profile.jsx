// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";

export default function Profile() {
  const storedUser = localStorage.getItem("loggedUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("loggedUser", JSON.stringify(profile));
    alert("✅ Profile updated successfully!");
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">👤 My Profile</h3>
      <div className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Department</label>
          <input
            type="text"
            className="form-control"
            name="department"
            value={profile.department}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
