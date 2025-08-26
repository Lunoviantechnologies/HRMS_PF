import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, Grid, Modal, TextField, Typography, } from "@mui/material";
import { Edit, Token } from "@mui/icons-material";
import axios from "axios";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { token, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    department: "HR",
    role: "Employee",
  });
  const [ employeeDetails, setEmployeeDetails ] = useState(null);
  // console.log(token);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated Employee Data:", formData);
    setOpen(false);
  };

  useEffect(()=>{
    axios.get(`${backendIP}/HRMS/api/employees/findByEmp/${user.id}`, {
      headers : {
        Authorization : token
      }
    }).then( res => {
      console.log(res.data);
      setEmployeeDetails(res.data);
    }).catch( err => {
      console.log(err);    
    })
  }, [token, user]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", p: 3 }}>
      <Card sx={{ maxWidth: 900, width: "100%", borderRadius: 3, boxShadow: 4, p: 5 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "primary.main", width: 100, height: 100 }}>
              {formData.fullName[0]}
            </Avatar>
          }
          title={
            <Box>
              <Typography variant="h4" fontWeight="600">
                {formData.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.role}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Edit />}
                sx={{ mt: 1 }}
                onClick={handleOpen}
              >
                Edit Profile
              </Button>
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {formData.email}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {formData.phone}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {formData.department}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {formData.role}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* About Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="600">
              About
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Dedicated and passionate employee with experience in HR operations,
              payroll management, and employee engagement. Skilled at
              communication and team collaboration.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            maxWidth: 500,
            width: "90%",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            mx: "auto",
            my: "10%",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            Edit Profile
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
