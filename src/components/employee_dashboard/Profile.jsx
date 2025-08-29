import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, Grid, Modal, TextField, Typography, } from "@mui/material";
import { Edit } from "@mui/icons-material";
import axios from "axios";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { token, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState([]);

  const handleOpen = (emp) => {
    setFormData(emp); // preload all data into form
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    console.log("Updated Employee Data:", formData);
    setOpen(false);

    try {
      // Convert your state into FormData
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const updatedEmpProfile = await axios.put(
        `${backendIP}/HRMS/api/employees/updateEmpBasicInfo/${user.sub}`,
        formDataToSend,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (updatedEmpProfile.status === 200) {
        alert("Profile updated");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile");
    }
  };

  useEffect(() => {
    axios
      .get(`${backendIP}/HRMS/api/employees/findByEmp/${user.sub}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setEmployeeDetails([res.data]); // wrap into array for map()
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", p: 3, }}>
      {employeeDetails.map((emp) => (
        <Card key={emp.id} sx={{ maxWidth: 900, width: "100%", borderRadius: 3, boxShadow: 4, p: 5 }}>
          <CardHeader
            avatar={
              <Avatar
                sx={{ bgcolor: "primary.main", width: 100, height: 100, fontSize: 36 }}
                src={emp.profilePhoto ? `data:image/jpeg;base64,${emp.profilePhoto}` : undefined}
              >
                {!emp.profilePhoto &&
                  (
                    (emp.firstName?.[0] || "-").toUpperCase() + (emp.lastName?.[0] || "-").toUpperCase()
                  )
                }
              </Avatar>
            }
            title={
              <Box>
                <Typography variant="h4" fontWeight="600">
                  {emp.firstName + " " + emp.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {emp.role ? emp.role.toLowerCase() : "Employee"}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Edit />}
                  sx={{ mt: 1 }}
                  onClick={() => handleOpen(emp)}
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
                    Working Email
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {emp.workEmail}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Personal Email
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {emp.emailId}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {emp.contactNumber1}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {emp.department}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {emp.role ? emp.role.toLowerCase() : 'Employee'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="600">
                Personal Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Date Of Birth
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.dateOfBirth}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Nationality
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.nationality}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.gender}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      House Number
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.houseNo}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      City
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.city}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      State
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.state}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="600">
                Family Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Father's Name
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.fatherName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Mother's Name
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.motherName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Marital Status
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.maritalStatus}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="600">
                ID Proofs
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Aadhar Number
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.aadharNumber &&
                        emp.aadharNumber.slice(0, -4).replace(/./g, "*") + emp.aadharNumber.slice(-4)
                      }
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Pan Card Number
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.panNumber &&
                        emp.panNumber.slice(0, -4).replace(/./g, "*") + emp.panNumber.slice(-4)
                      }
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Passport Number
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.passportNumber}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="600">
                Bank Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Bank Name
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.bankName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Account Number
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.accountNo &&
                        emp.accountNo.slice(0, -4).replace(/./g, "*") + emp.accountNo.slice(-4)
                      }
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      ifsc Code
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.ifscCode}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Bank Branch
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {emp.bankBranch}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* About Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="600">
                About
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Dedicated and passionate employee with experience in {emp.department},
                payroll management, and employee engagement. Skilled at
                communication and team collaboration.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Edit Profile Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            maxWidth: 600,
            width: "90%",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            mx: "auto",
            my: "5%",
            boxShadow: 24,
            maxHeight: "80vh",
            overflowY: "auto", // makes it scrollable
          }}
        >
          <Typography variant="h6" mb={2}>
            Edit Profile
          </Typography>

          {/* Editable fields */}
          <Grid container spacing={2}>
            {[
              { label: "Profile Photo", name: "profilePhoto" },
              { label: "First Name", name: "firstName" },
              { label: "Last Name", name: "lastName" },
              { label: "Work Email", name: "workEmail", disabled: true },
              { label: "Personal Email", name: "emailId", disabled: true },
              { label: "Phone", name: "contactNumber1" },
              { label: "Department", name: "department" },
              { label: "Role", name: "role" },
              { label: "Date of Birth", name: "dateOfBirth" },
              { label: "Nationality", name: "nationality" },
              { label: "Gender", name: "gender" },
              { label: "House Number", name: "houseNo" },
              { label: "City", name: "city" },
              { label: "State", name: "state" },
              { label: "Father's Name", name: "fatherName" },
              { label: "Mother's Name", name: "motherName" },
              { label: "Marital Status", name: "maritalStatus" },
              { label: "Aadhar Number", name: "aadharNumber" },
              { label: "PAN Number", name: "panNumber" },
              { label: "Passport Number", name: "passportNumber" },
              { label: "Bank Name", name: "bankName" },
              { label: "Account Number", name: "accountNo" },
              { label: "IFSC Code", name: "ifscCode" },
              { label: "Bank Branch", name: "bankBranch" },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                {field.name === "profilePhoto" ? (
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Upload Profile Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setFormData({ ...formData, profilePhoto: file });
                      }}
                    />
                  </Button>
                ) : (
                  <TextField
                    fullWidth
                    margin="normal"
                    label={field.label}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    disabled={field.disabled || false}
                  />
                )}
              </Grid>
            ))}
          </Grid>

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

