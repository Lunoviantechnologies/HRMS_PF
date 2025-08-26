import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [auth, setAuth] = useState({
        email: '',
        password: ''
    });

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post(`${backendIP}/HRMS/login`, auth)
            .then(res => {
                let token = "";
                if (typeof res.data === "string") {
                    token = res.data;
                } else if (res.data.token) {
                    token = res.data.token;
                }

                if (token) {
                    login(token, rememberMe, navigate);
                    alert('Login Successful');
                } else {
                    alert("Invalid login response");
                }
            })
            .catch(err => {
                console.log(err);
                alert('Please give correct credentials');
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

            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="form_login col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 p-4 rounded shadow">

                            <div className="text-center mb-2">
                                <img src="/lunovianLogo.jpg" id="lunovianLogo" alt="lunovianLogo"
                                    className="img-fluid"
                                    style={{ maxHeight: "100px", backgroundColor: 'black', borderRadius: '500px' }} />
                            </div>

                            <div className="text-center mb-4">
                                <h2>Login</h2>
                            </div>

                            <form onSubmit={handleLogin}>
                                <div className="form-floating mb-3">
                                    <input
                                        className="form-control adminLoginInput"
                                        id="loginEmail"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        disabled={loading}
                                        onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                                    />
                                    <label htmlFor="loginEmail">Email address</label>
                                </div>

                                <div className="form-floating mb-3 position-relative">
                                    <input
                                        className="form-control adminLoginInput"
                                        id="loginPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        required
                                        disabled={loading}
                                        onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                                    />
                                    <label htmlFor="loginPassword">Password</label>

                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="position-absolute top-50 end-0 translate-middle-y me-3"
                                        style={{ cursor: 'pointer', zIndex: 10 }}
                                    >
                                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                    </span>
                                </div>

                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        id="loginRemember"
                                        type="checkbox"
                                        checked={rememberMe}
                                        disabled={loading}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="loginRemember">Remember Password</label>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Link to={'/forgotPassword'} className="small text-decoration-none">Forgot Password?</Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Logging in...
                                            </>
                                        ) : (
                                            "Login"
                                        )}
                                    </button>
                                </div>

                                <hr />

                                <div className="text-center">
                                    <Link to={'/signUp'} className="small text-decoration-none">Need an account? Please SignUp!</Link>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>

            {/* Styles for overlay */}
            <style jsx="true">{`
                .overlay-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 1050;
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
