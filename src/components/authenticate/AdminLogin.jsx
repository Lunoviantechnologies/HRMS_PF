import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [auth, setAuth] = useState({ email: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        axios
            .post(`${backendIP}/login`, auth)
            .then((res) => {
                let token = "";
                if (typeof res.data === "string") {
                    token = res.data;
                } else if (res.data.token) {
                    token = res.data.token;
                }

                if (token) {
                    login(token, rememberMe, navigate);
                    alert("Login Successful");
                } else {
                    alert("Invalid login response");
                }
            })
            .catch((err) => {
                console.log(err);
                alert("Please give correct credentials");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="adminLoginPage">
            {/* Overlay Loader */}
            {loading && (
                <div className="overlay-loader">
                    <div className="spinner-border text-light" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-light mt-2">Please wait...</p>
                </div>
            )}

            <div className="min-vh-100 d-flex align-items-center justify-content-center login-bg">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
                            <div className="login-card p-4 rounded shadow">
                                <div className="text-center mb-4">
                                    <img
                                        src="/lunovianLogo.jpg"
                                        alt="logo"
                                        className="img-fluid"
                                        style={{
                                            maxHeight: "60px",
                                            borderRadius: "50%",
                                            backgroundColor: "black",
                                            padding: "5px",
                                        }}
                                    />
                                    <h4 className="fw-bold mt-3 text-white">Sign into Lunovian</h4>
                                </div>

                                <form onSubmit={handleLogin}>
                                    <div className="form-floating mb-3">
                                        <input
                                            className="form-control"
                                            id="loginEmail"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            disabled={loading}
                                            onChange={(e) =>
                                                setAuth({ ...auth, email: e.target.value })
                                            }
                                        />
                                        <label className="text-white" htmlFor="loginEmail">Email address</label>
                                    </div>

                                    <div className="form-floating mb-3 position-relative">
                                        <input
                                            className="form-control"
                                            id="loginPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            required
                                            disabled={loading}
                                            onChange={(e) =>
                                                setAuth({ ...auth, password: e.target.value })
                                            }
                                        />
                                        <label className="text-white" htmlFor="loginPassword">Password</label>

                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="position-absolute top-50 end-0 translate-middle-y me-3"
                                            style={{ cursor: "pointer", zIndex: 10 }}
                                        >
                                            <i
                                                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"
                                                    }`}
                                            ></i>
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                id="loginRemember"
                                                type="checkbox"
                                                checked={rememberMe}
                                                disabled={loading}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                            />
                                            <label className="form-check-label text-white" htmlFor="loginRemember">
                                                Remember me
                                            </label>
                                        </div>
                                        <Link to={"/forgotPassword"} className="small text-decoration-none text-white fw-semibold">
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <button type="submit" className="btn btn-success w-100 mb-3" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Logging in...
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx="true">
                {`
                    .login-bg {
                        background: linear-gradient(235deg, #1d1d1d, #248497ff);
                    }

                    .login-card {
                        border-radius: 15px;
                        box-shadow: 10px 10px 25px rgba(6, 0, 0, 0.6);
                        animation: fadeInUp 0.6s ease;
                    }

                    .login-card:hover {
                        background: linear-gradient(100deg, #1d1d1d, #248497ff);
                        box-shadow: 8px 10px 25px rgba(5, 0, 0, 0.6);
                    }

                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .form-control {
                        background: transparent !important;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        color: #fff;
                        transition: all 0.3s ease;
                    }

                    .form-control:focus {
                        border-color: #1aa34a !important;
                        box-shadow: 0 0 8px rgba(26, 163, 74, 0.6);
                        background: transparent !important;
                        color: #fff;
                    }

                    .form-control::placeholder {
                        color: rgba(255, 255, 255, 0.5);
                    }

                    .btn-success {
                        background: linear-gradient(270deg, #024f1cff, #1aa34a);
                        background-size: 600% 600%;
                        border: none;
                        transition: all 0.3s ease;
                        color: #fff;
                        font-weight: 500;
                        position: relative;
                        overflow: hidden;
                    }

                    .btn-success:hover {
                        animation: rotateGradient 3s linear infinite;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
                    }

                    @keyframes rotateGradient {
                        0% {
                            background-position: 0% 50%;
                        }
                        25% {
                            background-position: 50% 100%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                        75% {
                            background-position: 50% 0%;
                        }
                        100% {
                            background-position: 0% 50%;
                        }
                    }
                `}
            </style>

        </div>
    );
};

export default AdminLogin;
