import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, MenuItem, Typography, Select, InputLabel, FormControl } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import backendIP from "../../api";

const Employee_LeaveRequest = () => {
    const { user, token } = useAuth();
    const [formData, setFormData] = useState({
        employeeEmail: `${user?.id}`,
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: ""
    });

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        try {
            const response = await axios.post(`${backendIP}/HRMS/api/leaves/apply-leave/${user.id}`, formData, {
                headers : {
                    Authorization : token,
                    "Content-Type": "application/json"
                }
            });
            alert("Leave request submitted successfully!")
            setSuccessMsg("Leave request submitted successfully!");
            setErrorMsg("");
            console.log("Submitted:", response.data);

            // Clear form
            setFormData({
                employeeEmail: `${user?.id}`,
                leaveType: "",
                startDate: "",
                endDate: "",
                reason: ""
            });
        } catch (error) {
            setErrorMsg("Failed to submit leave request.");
            setSuccessMsg("");
            console.error(error);
        }
    };

    return (
        <Box sx={{ maxWidth: 500, margin: "auto", mt: 4, p: 3, boxShadow: 5, borderRadius: 2, backgroundColor : 'white'}}>
            <Typography variant="h5" gutterBottom>
                Leave Request Form
            </Typography>

            {successMsg && <Typography color="green">{successMsg}</Typography>}
            {errorMsg && <Typography color="red">{errorMsg}</Typography>}

            <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Employee Email ID" name="employeeEmail" value={formData.employeeEmail} disabled onChange={handleChange} margin="normal" 
                    sx={{'& .MuiInputBase-input' : { color: 'red' }, '& .MuiInputLabel-root': { color: 'red'}, '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'red' }}}/>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Leave Type</InputLabel>
                    <Select name="leaveType" value={formData.leaveType} onChange={handleChange} required>
                        <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                        <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                        <MenuItem value="Earned Leave">Earned Leave</MenuItem>
                        <MenuItem value="Unpaid Leave">Unpaid Leave</MenuItem>
                        <MenuItem value="Compensatory Leave">Compensatory Off</MenuItem>
                        <MenuItem value="Maternity/Paternity Leave">Maternity/Paternity Leave</MenuItem>
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

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Submit Request
                </Button>

            </form>
        </Box>
    );
};

export default Employee_LeaveRequest;