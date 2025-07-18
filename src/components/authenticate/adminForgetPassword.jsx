import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, TextField, Button, Card, CardContent, CardHeader, CardActions } from '@mui/material';

export default function AdminForgotPassword() {
    const [email, setEmail] = useState('');

    const handleReset = () => {
        // Add reset password logic here (API call, etc.)
        // console.log(`${email}`)
        alert(`Reset link sent to ${email}`);
    };

    return (
        <>
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', backgroundColor: '#021e3b', }}>
                <Container>
                    <Grid container justifyContent="center">
                        <Grid item xs={12} sm={8} md={6} lg={5}>
                            <Card elevation={4} sx={{ mt: 5, backgroundColor: '#e2ebef ' }}>
                                <CardHeader title="Password Recovery" titleTypographyProps={{ align: 'center', variant: 'h5' }} />
                                <CardContent>
                                    <div className="text-center mb-2">
                                        <img src="/lunovianLogo.jpg" id="lunovianLogo" alt="lunovianLogo" className="img-fluid"
                                            style={{ maxHeight: "100px", backgroundColor: 'black', borderRadius: '500px' }} />
                                    </div>
                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        Enter your email address and we will send you a link to reset your password.
                                    </Typography>

                                    <TextField label="Email Address" type="email" fullWidth value={email}
                                        onChange={(e) => setEmail(e.target.value)} margin="normal" required />

                                    <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                                        <Link to={'/'} className="small text-decoration-none">Return to login</Link>
                                        <Button variant="contained" onClick={handleReset}>
                                            Reset Password
                                        </Button>
                                    </Box>
                                </CardContent>

                                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                    <Typography variant="body2">
                                        <Link to={'/signUp'} className="small text-decoration-none">Need an account? Please SignUp!</Link>
                                    </Typography>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}
