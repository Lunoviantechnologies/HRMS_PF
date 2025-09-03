import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {Box, Container, Grid, Typography, TextField, Button, Card, CardContent, CardHeader, CardActions, IconButton, InputAdornment} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; 
import backendIP from "../../api";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = validate, 3 = reset password
  const [message, setMessage] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Step 1: Send OTP
  const handleSendOtp = async () => {
    try {
        setLoading(true);
      const res = await axios.post(`${backendIP}/api/otp/send/${email}`);
      setMessage(res.data);
      setStep(2);
    } catch (err) {
      setMessage("Error sending OTP: " + (err.response?.data || err.message));
    } finally{
        setLoading(false);
    }
  };

  // ✅ Step 2: Validate OTP
  const handleValidateOtp = async () => {
    try {
        setLoading(true);
        const res = await axios.post( `${backendIP}/api/otp/validateOtp`, { email: email, otp: otp },
            { headers: { "Content-Type": "application/json" } }
        );
        setMessage(res.data);
        setStep(3);
    } catch (err) {
      setMessage("Error validating OTP: " + (err.response?.data || err.message));
    } finally {
        setLoading(false);
    }
  };

  // ✅ Step 3: Update Password
  const handleResetPassword = async () => {
    try {
        setLoading(true);
      const res = await axios.post( `${backendIP}/api/otp/update-password`,
        { email: email, otp: otp, newPassword: newPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage(res.data);
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      navigate('/');
    } catch (err) {
      setMessage(
        "Error updating password: " + (err.response?.data || err.message)
      );
    } finally{
        setLoading(false);
    }
  };
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", backgroundColor: "#021e3b",}} >
      <Container>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6} lg={5}>
            <Card elevation={4} sx={{ mt: 5, backgroundColor: "#e2ebef " }}>
              <CardHeader title="Password Recovery" titleTypographyProps={{ align: "center", variant: "h5" }}/>
              <CardContent>
                <div className="text-center mb-2">
                  <img
                    src="/lunovianLogo.jpg"
                    id="lunovianLogo"
                    alt="lunovianLogo"
                    className="img-fluid"
                    style={{
                      maxHeight: "100px",
                      backgroundColor: "black",
                      borderRadius: "500px",
                    }}
                  />
                </div>

                {step === 1 && (
                  <>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Enter your email address to receive OTP for password reset.
                    </Typography>
                    <TextField
                      label="Email Address"
                      type="email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      margin="normal"
                      required
                    />
                    <Box mt={3} display="flex" justifyContent="space-between">
                      <Link to={"/"} className="small text-decoration-none">
                        Return to login
                      </Link>
                      <Button variant="contained" onClick={handleSendOtp} disabled={loading}>
                        { loading ? "Sending..." : "Send OTP"}
                      </Button>
                    </Box>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Enter the OTP sent to your email.
                    </Typography>
                    <TextField
                      label="Enter OTP"
                      type="text"
                      fullWidth
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      margin="normal"
                      required
                    />
                    <Box mt={3} display="flex" justifyContent="flex-end">
                      <Button variant="contained" onClick={handleValidateOtp} disabled={loading}>
                        { loading ? "Validating..." : "Validate OTP"}
                      </Button>
                    </Box>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Enter your new password.
                    </Typography>
                    <TextField
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        margin="normal"
                        required
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            ),
                        }}
                    />
                    <Box mt={3} display="flex" justifyContent="flex-end">
                      <Button variant="contained" onClick={handleResetPassword} disabled={loading}>
                        { loading ? "Updating..." : "Update Password"}
                      </Button>
                    </Box>
                  </>
                )}

                {message && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {message}
                  </Typography>
                )}
              </CardContent>

              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Typography variant="body2">
                  <Link to={"/signUp"} className="small text-decoration-none">
                    Need an account? Please SignUp!
                  </Link>
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

}