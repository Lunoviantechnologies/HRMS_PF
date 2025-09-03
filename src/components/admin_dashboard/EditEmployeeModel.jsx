import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Button, Avatar, Typography } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import backendIP from "../../api";

const EditEmployeeModel = ({ show, onHide, employee }) => {
  const { token } = useAuth();
  const [employeeDetails, setEmployeeDetails] = useState({});

  useEffect(() => {
    if (employee) {
      setEmployeeDetails({ ...employee });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setEmployeeDetails((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      for (const key in employeeDetails) {
        const value = employeeDetails[key];
        // Skip empty values
        if (value === undefined || value === null) continue;

        // If it's a File, append to FormData
        if (value instanceof File) {
          formDataToSend.append(key, value);
        }
        // If it's one of the file fields but NOT a File, skip (existing base64 or fileName)
        else if (["profilePhoto", "document1", "document2", "document3"].includes(key)) {
          continue;
        }
        // For everything else (text fields)
        else {
          formDataToSend.append(key, value);
        }
      }

      const response = await axios.put(`${backendIP}/api/employees/update/${employeeDetails.id}`, formDataToSend,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update response:", formDataToSend);
      alert("Employee details updated successfully");
      onHide();
      // setEmployeeDetails(employeeDetails.map( emp =>{
      //   emp.id === formDataToSend.id ? { ...emp, ...formDataToSend } : emp
      // }));
    } catch (err) {
      // console.error("Error updating employee:", err);
      alert("Failed to update employee details");
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={show} onClose={onHide} maxWidth="md" fullWidth>
      <DialogTitle>Edit Employee Profile</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>

          {/* Avatar and name */}
          <Grid item xs={12} container justifyContent="center" alignItems="center" direction="column">
            <Avatar src={employee.profilePhoto && typeof employee.profilePhoto === "string" ? `data:image/jpeg;base64,${employee.profilePhoto}`
              : ""} sx={{ width: 80, height: 80, bgcolor: "#ccc", fontSize: 24 }}
            >
              {
                (!employee.profilePhoto && employee.firstName)
                  ? employee.firstName[0].toUpperCase() + (employee.lastName?.[0] || "").toUpperCase() : ""
              }
            </Avatar>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              {employee.firstName} {employee.lastName}
            </Typography>
          </Grid>

          {/* All text inputs */}
          {[
            "prefix", "firstName", "lastName", "emailId", "contactNumber1", "gender", "dateOfBirth",
            "nationality", "workEmail", "joiningDate", "houseNo", "city", "state", "panNumber",
            "aadharNumber", "passportNumber", "fatherName", "motherName", "maritalStatus",
            "previousCompanyName", "previousExperience", "department", "designation", "previousCtc",
            "higherQualification", "bankName", "accountNo", "ifscCode", "bankBranch",
            "basicEmployeeSalary", "password"
          ].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField fullWidth name={field}
                label={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                value={employeeDetails[field] || ""} onChange={handleChange}
              />
            </Grid>
          ))}

          {/* File upload inputs */}
          {[
            { name: "profilePhoto", label: "Upload Profile Photo", accept: "image/*" },
            { name: "document1", label: "Upload Document 1" },
            { name: "document2", label: "Upload Document 2" },
            { name: "document3", label: "Upload Document 3" }
          ].map(({ name, label, accept }) => (
            <Grid item xs={12} sm={6} key={name}>
              <Button variant="outlined" component="label" fullWidth>
                {label}
                <input type="file" name={name} accept={accept || "*"} hidden onChange={handleFileChange} />
              </Button>

              {/* 👇 Show existing file name or preview if available */}
              {
                employeeDetails[name] && typeof employeeDetails[name] === "string" && (
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Existing File: {name}.pdf
                  </Typography>
                )
              }

              {/* 👇 Show newly selected file name */}
              {
                employeeDetails[name] && typeof employeeDetails[name] === "object" && (
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Selected: {employeeDetails[name].name}
                  </Typography>
                )
              }
            </Grid>
          ))}

        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onHide} variant="outlined" color="secondary">  Cancel </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary"> Save Changes  </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployeeModel;
