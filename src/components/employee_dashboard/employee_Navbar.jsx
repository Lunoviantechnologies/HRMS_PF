import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Employee_Navbar() {
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

    const handleAttendence = () => {
        navigate('/employee_dashboard/attendence');
    };

    const handleLeaveRequest = () => {
        navigate('/employee_dashboard/leaveRequest');
    };
      const handleSalary = () => {
        navigate('/employee_dashboard/salary');
    };
    


    return (
        <nav
            className="navbar navbar-dark sticky-top py-3"
            style={{ backgroundColor: 'rgb(0,0,51)' }}
        >
            <div className="container-fluid">
                <div className="row w-100 align-items-center">

                    {/* Left section - Logo + Title */}
                    <div className="col-md-4 d-flex align-items-center">
                        <button
                            className="btn btn-outline-light d-md-none me-2"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasSidebar"
                            aria-controls="offcanvasSidebar"
                        >
                            <i className="bi bi-list"></i>
                        </button>

                        <img
                            src="/lunovianLogo.jpg"
                            alt="Lunovian Logo"
                            className="me-3"
                            onClick={() => navigate('/employee_dashboard')}
                            style={{ height: '80px', width: '80px', borderRadius: '50%', cursor: 'pointer' }}
                        />
                        <span className="navbar-brand mb-0 h1">Lunovian Technologies</span>
                    </div>

                    {/* Middle section - Actions */}
                    <div className="col-md-5 d-flex justify-content-center">
                        <button className='btn btn-none border-0 text-white me-3' onClick={handleLeaveRequest}>
                            Leave Request
                        </button>
                        <button className='btn btn-none border-0 text-white' onClick={handleAttendence}>
                            Attendance
                        </button> 
                        <button className='btn btn-none border-0 text-white' onClick={handleSalary}>
                            SalaryDetails
                        </button>
                    </div>

                    {/* Right section - Notifications + User Dropdown */}
                    <div className="col-md-3 d-flex justify-content-end align-items-center">
                        <i className="bi bi-bell fs-5 text-white me-3"></i>
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
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <a className="dropdown-item"onClick={() => navigate('/employee_dashboard/profile')}>Profile</a>
                                </li>
                                <li>
                                    <a className="dropdown-item" onClick={() => navigate('/employee_dashboard/settings')}>Settings</a>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <a className="dropdown-item text-danger btn" onClick={handleLogout}>Logout</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
}
