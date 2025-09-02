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
            <nav
                className="navbar navbar-dark px-3 d-flex justify-content-between align-items-center sticky-top"
                style={{ height: '100px', backgroundColor: 'rgb(0,0,51)' }}
            >
                <div className="d-flex align-items-center flex-nowrap">
                    {/* Sidebar toggle button (mobile only) */}
                    <button
                        className="btn btn-outline-light d-md-none me-2"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasSidebar"   // <-- Sidebar.jsx offcanvas
                        aria-controls="offcanvasSidebar"
                    >
                        <i className="bi bi-list"></i>
                    </button>

                    {/* Logo */}
                    <img
                        src="/lunovianLogo.jpg"
                        alt="lunovianLogo"
                        className="me-2"
                        onClick={() => navigate('/dashboard')}
                        style={{ height: '60px', width: '60px', borderRadius: '50%', cursor: 'pointer',}}
                    />

                    {/* Brand Name (hidden on small screens) */}
                    <span className="navbar-brand mb-0 h1 d-none d-md-inline" onClick={() => navigate('/dashboard')}>
                        Lunovian Technologies
                    </span>
                </div>

                <div className="d-flex align-items-center flex-nowrap">
                    {/* Notification Icon */}
                    <div className="text-white me-2">
                        <i className="bi bi-bell fs-5 text-warning"></i>
                    </div>

                    {/* User Dropdown */}
                    <div className="dropdown">
                        <button
                            className="btn btn-dark dropdown-toggle d-flex align-items-center"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span
                                className="bg-light rounded-circle d-flex justify-content-center align-items-center fw-bold text-dark me-1"
                                style={{ width: '32px', height: '32px', fontSize: '14px', }}
                            >
                                {user?.sub?.[0].toUpperCase()}
                            </span>
                            {/* Hide username on small screens */}
                            <span className="d-none d-md-inline">{user?.sub}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <button className="dropdown-item" onClick={() => navigate('/dashboard/profile_admin')}>
                                    Profile
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={() => navigate('/dashboard/settings_admin')}>
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
                    </div>
                </div>
            </nav>
        </>
    );
}
