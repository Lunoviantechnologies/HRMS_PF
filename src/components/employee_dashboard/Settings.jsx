// src/pages/Settings.jsx
import React, { useState } from "react";

export default function Settings() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = () => {
    if (oldPassword && newPassword) {
      alert("🔑 Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } else {
      alert("⚠️ Please fill all password fields.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">⚙️ Settings</h3>
      <div className="card p-4 shadow-sm">

        {/* Theme Preference */}
        <div className="mb-3">
          <label className="form-label">Theme</label>
          <select
            className="form-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">🌞 Light</option>
            <option value="dark">🌙 Dark</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          <label className="form-check-label">Enable Notifications</label>
        </div>

        {/* Change Password */}
        <h5 className="mt-4">🔐 Change Password</h5>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-warning" onClick={handlePasswordChange}>
          Update Password
        </button>
      </div>
    </div>
  );
}
