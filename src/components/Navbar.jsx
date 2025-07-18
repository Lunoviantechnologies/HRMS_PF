import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    // console.log(user);

    const handleLogout = ()=>{
        logout(navigate);
    };

    return (
        <nav className="navbar navbar-dark px-3 d-flex justify-content-between align-items-center sticky-top" style={{ height: '100px', backgroundColor: 'rgb(0,0,51)' }}>
            <div className="d-flex align-items-center">
                <button className="btn btn-outline-light d-md-none me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar">
                    <i className="bi bi-list"></i>
                </button>

                <img
                    src="/lunovianLogo.jpg" // use absolute path if in public/
                    id="lunovianLogo"
                    alt="lunovianLogo"
                    className="me-3"
                    onClick={() => navigate('/dashboard')}
                    style={{ height: '80px', width: '80px', borderRadius: '50%', cursor: 'pointer' }}
                />

                <a className="navbar-brand mb-0 h1 me-3" href="#">
                    Lunovian Technologies
                </a>
            </div>

            <div className="d-flex align-items-center">
                <div className="input-group me-3 d-none d-sm-flex">
                    <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-search text-dark"></i>
                    </span>
                    <input className="form-control" type="search" name="navSearch" id="navSearch" placeholder="Check your query..." aria-label="Search" aria-describedby="basic-addon1" />
                </div>

                <div className="text-white me-3">
                    <i className="bi bi-bell fs-5"></i>
                </div>

                {/* Dropdown starts here */}
                <div className="dropdown">
                    <button
                        className="btn btn-dark dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="bi bi-person-circle fs-5 me-2"></i>
                        {user.sub}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                        <li>
                            <a className="dropdown-item" href="#" onClick={() => navigate('/profile')}>Profile</a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#" onClick={() => navigate('/settings')}>Settings</a>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <a className="dropdown-item text-danger" href="#" onClick={handleLogout}>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
