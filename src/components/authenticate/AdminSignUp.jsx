import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Container, Grid, Box, Typography, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import backendIP from '../../api';

export default function AdminSignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const key = e.target.name || e.target.id;
        setFormData(prev => ({ ...prev, [key]: e.target.value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password != formData.confirmPassword) {
            alert("Password should be match")
        }
        else {
            // console.log(formData);
            axios.post(`${backendIP}/admine_Register`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                alert("Account created!");
                navigate('/');
            }).catch(err => console.log(err));
        };
    };

    return (
        <>
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#021e3b', py: 4 }}>
                <Container maxWidth="sm">
                    <Paper elevation={4} sx={{ p: 4, borderRadius: 2, backgroundColor: '#e2ebef ' }}>
                        <div className="text-center mb-2">
                            <img src="/lunovianLogo.jpg" id="lunovianLogo" alt="lunovianLogo" className="img-fluid"
                                style={{ maxHeight: "100px", backgroundColor: 'black', borderRadius: '500px' }} />
                        </div>
                        <Typography variant="h5" textAlign="center" gutterBottom>
                            Create an Account
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField label="First Name" margin="normal" name='firstName' fullWidth required value={formData.firstName} onChange={handleChange} />
                            <TextField label="Last Name" margin="normal" name='lastName' fullWidth required value={formData.lastName} onChange={handleChange} />
                            <TextField label="Email Address" type="email" name='email' margin="normal" fullWidth required value={formData.email} onChange={handleChange} />

                            <Grid container spacing={2} mt={1}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Password" name='password' type="password" fullWidth required value={formData.password} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Confirm Password" name='confirmPassword' type="password" fullWidth required value={formData.confirmPassword} onChange={handleChange} />
                                </Grid>
                            </Grid>

                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
                                Create Account
                            </Button>

                            <Box textAlign="center" mt={2}>
                                <Link to={'/'} underline="hover" fontSize="small">
                                    Already have an account? Login!
                                </Link>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}
