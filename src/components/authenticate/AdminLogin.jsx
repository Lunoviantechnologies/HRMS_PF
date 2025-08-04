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
    })

    const handleLogin = (e) => {
        e.preventDefault();
        // console.log(auth);

        axios.post(`${backendIP}/HRMS/login`, auth).then(res => {
            alert('Login Successfull');

            let token = "";
            if (typeof res.data === "string") {
                token = res.data;
            } else if (res.data.token) {
                token = res.data.token;
            }
            if (token) {
                login(token, navigate); // ✅ use context login function and  pass navigate to context
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
                                    <input className="form-control adminLoginInput" id="loginEmail" type="email" placeholder="name@example.com" onChange={(e) => setAuth({ ...auth, email: e.target.value })} />
                                    <label htmlFor="loginEmail">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input className="form-control adminLoginInput" id="loginPassword" required type="password" placeholder="Password" onChange={(e) => setAuth({ ...auth, password: e.target.value })} />
                                    <label htmlFor="loginPassword">Password</label>
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
                                {/* <div className="text-center my-3">
                                    <span className="text-muted">or sign in with</span>
                                </div>

                                <div className="d-flex justify-content-center gap-3 mb-3">
                                    <a href="#" className="btn btn-outline-primary rounded-circle">
                                        <i className="bi bi-facebook"></i>
                                    </a>
                                    <a href="#" className="btn btn-outline-danger rounded-circle">
                                        <i className="bi bi-google"></i>
                                    </a>
                                </div> */}

                                <div className="text-center">
                                    <Link to={'/signUp'} className="small text-decoration-none">Need an account? Please SignUp!</Link>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default AdminLogin;