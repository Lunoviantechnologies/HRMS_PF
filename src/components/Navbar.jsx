import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout(navigate);
    };

    return (
        <>
            {/* Top Navbar */}
            <nav className="navbar navbar-dark px-3 d-flex justify-content-between align-items-center sticky-top" style={{ height: '100px', backgroundColor: 'rgb(0,0,51)' }}>
                <div className="d-flex align-items-center">
                    {/* Sidebar toggle button */}
                    <button
                        className="btn btn-outline-light d-md-none me-2"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasSidebar"
                        aria-controls="offcanvasSidebar"
                    >
                        <i className="bi bi-list"></i>
                    </button>

                    {/* Logo */}
                    <img
                        src="/lunovianLogo.jpg"
                        alt="lunovianLogo"
                        className="me-3"
                        onClick={() => navigate('/dashboard')}
                        style={{ height: '80px', width: '80px', borderRadius: '50%', cursor: 'pointer' }}
                    />

                    <span className="navbar-brand mb-0 h1">Lunovian Technologies</span>
                </div>

                <div className="d-flex align-items-center">
                    {/* Search Bar */}
                    <div className="input-group me-3 d-none d-sm-flex">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="bi bi-search text-dark"></i>
                        </span>
                        <input
                            className="form-control"
                            type="search"
                            placeholder="Check your query..."
                            aria-label="Search"
                        />
                    </div>

                    {/* Notification Icon */}
                    <div className="text-white me-3">
                        <i className="bi bi-bell fs-5"></i>
                    </div>

                    {/* User Dropdown */}
                    <div className="dropdown">
                        <button className="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown"
                            aria-expanded="false" style={{ display: "flex", alignItems: "center" }}>
                            <span
                                className="bg-light rounded-circle d-flex justify-content-center align-items-center fw-bold text-dark me-2"
                                style={{ width: "32px", height: "32px", lineHeight: "32px", fontSize: "14px" }}
                            >
                                {user?.sub?.[0].toUpperCase()}
                            </span>
                            <span>{user?.sub}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <button className="dropdown-item" onClick={() => navigate('/dashboard/profile_admin')}>Profile</button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => navigate('/dashboard/settings_admin')}>Settings</button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Offcanvas Sidebar */}
            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="offcanvasSidebar"
                aria-labelledby="offcanvasSidebarLabel"
            >
                <div className="offcanvas-header" style={{ backgroundColor: 'rgb(0,0,51)', color: '#fff' }}>
                    <h5 className="offcanvas-title" id="offcanvasSidebarLabel">Menu</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="list-group">
                        <li className="list-group-item list-group-item-action" onClick={() => navigate('/leave')}>
                            <i className="bi bi-calendar-check me-2"></i> Leave
                        </li>
                        <li className="list-group-item list-group-item-action" onClick={() => navigate('/attendance')}>
                            <i className="bi bi-clock-history me-2"></i> Attendance
                        </li>
                        <li className="list-group-item list-group-item-action" onClick={() => navigate('/profile')}>
                            <i className="bi bi-person me-2"></i> Profile
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
