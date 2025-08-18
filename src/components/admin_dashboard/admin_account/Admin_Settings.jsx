import React, { useState } from "react";
import { Card, CardContent, Typography, Grid, TextField, Button, Switch, FormControlLabel, Divider, Accordion, AccordionSummary, AccordionDetails,
    Box, InputAdornment, IconButton, Alert,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockReset from "@mui/icons-material/LockReset";

export default function Admin_Settings() {
    const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
    const [show, setShow] = useState({ current: false, next: false, confirm: false });
    const [pwdError, setPwdError] = useState("");
    const [pwdSuccess, setPwdSuccess] = useState("");

    const handlePwdChange = (e) => {
        setPwd((s) => ({ ...s, [e.target.name]: e.target.value }));
        setPwdError("");
        setPwdSuccess("");
    };

    const toggleShow = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));

    const submitPassword = (e) => {
        e.preventDefault();
        setPwdError("");
        setPwdSuccess("");

        if (!pwd.current || !pwd.next || !pwd.confirm) {
            setPwdError("Please fill all password fields.");
            return;
        }
        if (pwd.next.length < 8) {
            setPwdError("New password must be at least 8 characters.");
            return;
        }
        if (pwd.next !== pwd.confirm) {
            setPwdError("New password and confirmation do not match.");
            return;
        }

        // TODO: Replace with your API call (axios/fetch)
        // await axios.post('/api/auth/change-password', { current: pwd.current, next: pwd.next }, { headers: { Authorization: token }})
        setPwdSuccess("Password updated successfully.");
        setPwd({ current: "", next: "", confirm: "" });
    };

    return (
        <Grid container spacing={3} sx={{ p: { xs: 2, md: 4 } }}>
            {/* Profile Settings */}
            <Grid item xs={12} md={6}>
                <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <Typography variant="h6">Profile Settings</Typography>
                        <Divider sx={{ my: 2 }} />
                        <TextField fullWidth label="Full Name" margin="normal" />
                        <TextField fullWidth label="Email" type="email" margin="normal" />
                        <TextField fullWidth label="Phone Number" type="tel" margin="normal" />
                        <Box mt="auto">
                            <Button fullWidth variant="contained" sx={{ mt: 2 }}>
                                Update Profile
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Security (Toggles only) */}
            <Grid item xs={12} md={6}>
                <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <Typography variant="h6">Security</Typography>
                        <Divider sx={{ my: 2 }} />
                        <FormControlLabel control={<Switch defaultChecked />} label="Two-Factor Authentication" />
                        <FormControlLabel control={<Switch />} label="Login Alerts (Email)" />
                        <FormControlLabel control={<Switch />} label="Allow New Device Logins" />
                        <Box mt="auto">
                            <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                                Save Security Settings
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Change Password - NEW CARD */}
            <Grid item xs={12} md={6}>
                <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <LockReset fontSize="small" />
                            <Typography variant="h6">Change Password</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />

                        {pwdError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {pwdError}
                            </Alert>
                        )}
                        {pwdSuccess && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {pwdSuccess}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={submitPassword} sx={{ display: "grid", gap: 2, flexGrow: 1 }}>
                            <TextField
                                fullWidth
                                label="Current Password"
                                type={show.current ? "text" : "password"}
                                name="current"
                                value={pwd.current}
                                onChange={handlePwdChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => toggleShow("current")} edge="end" aria-label="toggle current password visibility">
                                                {show.current ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="New Password"
                                type={show.next ? "text" : "password"}
                                name="next"
                                value={pwd.next}
                                onChange={handlePwdChange}
                                helperText="Minimum 8 characters. Use a mix of letters, numbers, and symbols."
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => toggleShow("next")} edge="end" aria-label="toggle new password visibility">
                                                {show.next ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                type={show.confirm ? "text" : "password"}
                                name="confirm"
                                value={pwd.confirm}
                                onChange={handlePwdChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => toggleShow("confirm")} edge="end" aria-label="toggle confirm password visibility">
                                                {show.confirm ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box mt="auto">
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 1 }}>
                                    Update Password
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* HR Policies */}
            <Grid item xs={12} md={6}>
                <Accordion sx={{ height: "100%" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">HR Policies</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField fullWidth label="Annual Leaves" type="number" margin="normal" />
                        <TextField fullWidth label="Sick Leaves" type="number" margin="normal" />
                        <FormControlLabel control={<Switch />} label="Allow Carry Forward" />
                        <Box mt={2}>
                            <Button fullWidth variant="outlined">Save Policy</Button>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Grid>

            {/* Organization Settings */}
            <Grid item xs={12} md={6}>
                <Accordion sx={{ height: "100%" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Organization Settings</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField fullWidth label="Company Name" margin="normal" />
                        <TextField fullWidth label="Address" margin="normal" />
                        <TextField fullWidth label="Add Department" margin="normal" />
                        <Box mt={2}>
                            <Button fullWidth variant="contained" color="success">Save Organization</Button>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Grid>

            {/* Notifications */}
            <Grid item xs={12} md={6}>
                <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">Notifications & Preferences</Typography>
                        <Divider sx={{ my: 2 }} />
                        <FormControlLabel control={<Switch defaultChecked />} label="Email Notifications" />
                        <FormControlLabel control={<Switch />} label="Push Notifications" />
                        <FormControlLabel control={<Switch />} label="Weekly Reports" />
                    </CardContent>
                </Card>
            </Grid>

            {/* Danger Zone */}
            <Grid item xs={12} md={6}>
                <Card
                    sx={{ display: "flex", flexDirection: "column", height: "100%", border: (theme) => `1px solid ${theme.palette.error.main}` }}
                >
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <Typography variant="h6" color="error">Danger Zone</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={2} sx={{ mt: "auto" }}>
                            <Grid item xs={12} sm={6}>
                                <Button fullWidth variant="outlined" color="error">Delete Company Account</Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button fullWidth variant="outlined" color="warning">Reset All Data</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
