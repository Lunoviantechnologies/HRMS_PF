import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationMenu from "./Notification";

export default function Employee_Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const handleLogout = () => logout(navigate);
  const handleLeaveRequest = () => navigate("/employee_dashboard/leaveRequest");
  const handleSalary = () => navigate("/employee_dashboard/salary");
  const handleAttendence = () => navigate("/employee_dashboard/attendence");
  const handleNotificationClose = () => setAnchorEl(null);

  return (
    <nav
      className="navbar navbar-expand-md navbar-dark sticky-top py-3"
      style={{ backgroundColor: "rgb(0,0,51)" }}
    >
      <div className="container-fluid">
        {/* Logo + Title */}
        <a
          className="navbar-brand d-flex align-items-center"
          onClick={() => navigate("/employee_dashboard")}
          style={{ cursor: "pointer" }}
        >
          <img
            src="/lunovianLogo.jpg"
            alt="Lunovian Logo"
            className="me-2"
            style={{ height: "60px", width: "60px", borderRadius: "50%" }}
          />
          <span className="fw-bold">Lunovian Technologies</span>
        </a>

        {/* Toggle button for small screens */}
        <button
          className="navbar-toggler text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#employeeNavbar"
          aria-controls="employeeNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="employeeNavbar">
          {/* Center Nav Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-md-0">
            <li className="nav-item">
              <button className="btn nav-link text-white" onClick={handleLeaveRequest}>
                Leave Request
              </button>
            </li>
            <li className="nav-item">
              <button className="btn nav-link text-white" onClick={handleAttendence}>
                Attendance
              </button>
            </li>
            <li className="nav-item">
              <button className="btn nav-link text-white" onClick={handleSalary}>
                Salary Details
              </button>
            </li>
          </ul>

          {/* Right Side */}
          <ul className="navbar-nav ms-auto">
            {/* Desktop: show inline */}
            <li className="nav-item text-warning d-none d-md-flex align-items-center me-3">
              <NotificationMenu
                anchorEl={anchorEl}
                handleClose={handleNotificationClose}
                notifications={notifications}
              />
            </li>

            <li className="nav-item dropdown d-none d-md-flex">
              <button
                className="btn btn-dark dropdown-toggle d-flex align-items-center"
                type="button"
                id="desktopDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {/* Initials circle always visible */}
                <span
                  className="bg-light rounded-circle d-flex justify-content-center align-items-center fw-bold text-dark me-2"
                  style={{
                    width: "32px",
                    height: "32px",
                    lineHeight: "32px",
                    fontSize: "14px",
                  }}
                >
                  {user?.sub?.[0]?.toUpperCase()}
                </span>

                {/* Name: hidden on tablet & mobile */}
                <span className="d-none d-lg-inline">{user?.sub}</span>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="desktopDropdown"
              >
                <li>
                  <button
                    className="dropdown-item text-warning"
                    onClick={() => navigate("/employee_dashboard/profile")}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item text-warning"
                    onClick={() => navigate("/employee_dashboard/settings")}
                  >
                    Settings
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>

            {/* Mobile: show inside collapse */}
            <li className="nav-item d-flex d-md-none flex-column mt-2">
              <NotificationMenu
                anchorEl={anchorEl}
                handleClose={handleNotificationClose}
                notifications={notifications}
              />
              <div className="mt-2 border-top pt-2">
                <button
                  className="btn btn-dark dropdown-toggle w-100"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#mobileProfileMenu"
                >
                  {user?.sub}
                </button>
                <div className="collapse mt-2" id="mobileProfileMenu">
                  <button
                    className="dropdown-item text-warning"
                    onClick={() => navigate("/employee_dashboard/profile")}
                  >
                    Profile
                  </button>
                  <button
                    className="dropdown-item text-warning"
                    onClick={() => navigate("/employee_dashboard/settings")}
                  >
                    Settings
                  </button>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
