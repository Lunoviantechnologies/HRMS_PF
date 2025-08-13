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

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();

        axios.post(`${backendIP}/HRMS/login`, auth).then(res => {
            alert('Login Successful');
            let token = "";
            if (typeof res.data === "string") {
                token = res.data;
            } else if (res.data.token) {
                token = res.data.token;
            }
            if (token) {
                login(token, navigate);
            } else {
                alert("Invalid login response");
            }
        }).catch(err => {
            console.log(err);
            alert('Please give correct credentials');
        });
    };

    return (
        <div className="adminLoginPage">
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="form_login col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 p-4 rounded shadow">

                            <div className="text-center mb-2">
                                <img src="/lunovianLogo.jpg" id="lunovianLogo" alt="lunovianLogo" className="img-fluid"
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
                                    <input className="form-check-input" id="loginRemember" type="checkbox" />
                                    <label className="form-check-label" htmlFor="loginRemember">Remember Password</label>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Link to={'/forgotPassword'} className="small text-decoration-none">Forgot Password?</Link>
                                    <button type="submit" className="btn btn-primary px-4">Login</button>
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
        </div>
    );
};

export default AdminLogin;
