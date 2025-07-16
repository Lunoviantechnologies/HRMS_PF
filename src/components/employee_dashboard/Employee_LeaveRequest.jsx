import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, MenuItem, Typography, Select, InputLabel, FormControl } from "@mui/material";

const Employee_LeaveRequest = () => {
    const [formData, setFormData] = useState({
        employeeId: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
        status: "Pending",
    });

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://192.168.1.43:2323/api/LeaveRequest/submit", formData);
            setSuccessMsg("Leave request submitted successfully!");
            setErrorMsg("");
            console.log("Submitted:", response.data);

            // Clear form
            setFormData({
                employeeId: "",
                leaveType: "",
                startDate: "",
                endDate: "",
                reason: "",
                status: "Pending",
            });
        } catch (error) {
            setErrorMsg("Failed to submit leave request.");
            setSuccessMsg("");
            console.error(error);
        }
    };

    return (
        <Box sx={{ maxWidth: 500, margin: "auto", mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
                Leave Request Form
            </Typography>

            {successMsg && <Typography color="green">{successMsg}</Typography>}
            {errorMsg && <Typography color="red">{errorMsg}</Typography>}

            <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} margin="normal"
                    required />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Leave Type</InputLabel>
                    <Select name="leaveType" value={formData.leaveType} onChange={handleChange} required>
                        <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                        <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                        <MenuItem value="Paid Leave">Paid Leave</MenuItem>
                        <MenuItem value="Unpaid Leave">Unpaid Leave</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    fullWidth
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    fullWidth
                    label="Reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                    rows={3}
                    required
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select name="status" value={formData.status} onChange={handleChange}>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Submit Request
                </Button>

            </form>
        </Box>
    );
};

export default Employee_LeaveRequest;