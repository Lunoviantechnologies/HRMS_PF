import React from "react";
import { Avatar, Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";

export default function Admin_Profile() {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}>
            <Card sx={{ maxWidth: 800, width: "100%", boxShadow: 4, borderRadius: 3 }}>
                <CardContent sx={{ p: 6 }}>
                    {/* Header */}
                    <Box sx={{ display: "flex", alignItems: "center", borderBottom: "1px solid #eee", pb: 4, mb: 4 }}>
                        <Avatar sx={{ bgcolor: "primary.main", width: 96, height: 96, fontSize: 36, fontWeight: "bold" }}>A</Avatar>
                        <Box sx={{ ml: 4, flexGrow: 1 }}>
                            <Typography variant="h5" fontWeight="600" color="text.primary">
                                Admin Name
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                System Administrator
                            </Typography>
                            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                                <Button variant="outlined" size="small" startIcon={<Edit />}>Edit Profile</Button>
                                <Button variant="contained" size="small">Manage Users</Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* Info Grid */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Full Name</Typography>
                                <Typography variant="body1" fontWeight="500">Admin Name</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Email</Typography>
                                <Typography variant="body1" fontWeight="500">admin@example.com</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Phone</Typography>
                                <Typography variant="body1" fontWeight="500">+91 98765 43210</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Role</Typography>
                                <Typography variant="body1" fontWeight="500">Super Admin</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* About */}
                    <Box sx={{ mt: 5 }}>
                        <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
                            About
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Experienced HR and IT administrator with over 10 years of experience in employee management, payroll systems, and enterprise security. Skilled in managing multiple teams and ensuring smooth operations of HRMS platforms.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
