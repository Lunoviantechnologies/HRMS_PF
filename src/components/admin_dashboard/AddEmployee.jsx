import React, { useState, useEffect } from "react";
import { Card, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const AddEmployee = () => {
    const {token} = useAuth();    
    const [step, setStep] = useState(() => {
        const savedStep = localStorage.getItem('currentStep');
        return savedStep ? parseInt(savedStep, 10) : 0;
    });

    const [formData, setFormData] = useState({
        prefix: '',
        firstName: '',
        lastName: '',
        emailId: '',
        contactNumber1: '',
        gender: '',
        dateOfBirth: '',
        nationality: '',
        workEmail: '',
        joiningDate: '',
        houseNo: '',
        city: '',
        state: '',
        panNumber: '',
        aadharNumber: '',
        passportNumber: '',
        fatherName: '',
        motherName: '',
        maritalStatus: '',
        previousCompanyName: '',
        previousExperience: '',
        department: '',
        designation: '',
        previousCtc: '',
        higherQualification: '',
        bankName: '',
        accountNo: '',
        ifscCode: '',
        bankBranch: '',
        profilePhoto: '',
        imageDir: '',
        document1: '',
        document2: '',
        document3: '',
        basicEmployeeSalary: 0,
        password: ''
    });

    useEffect(() => {
        localStorage.setItem('currentStep', step);
    }, [step]);

    const handleChange = (e) => {
        const key = e.target.name || e.target.id;
        setFormData(prev => ({ ...prev, [key]: e.target.value }));
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        } else {
            alert("Please fill in all required fields before proceeding.");
        }
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = () => {
        console.log("Submitted Data:", formData);

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (formData[key]) {
                formDataToSend.append(key, formData[key]);
            }
        };

        setFormData({
            prefix: '',
            firstName: '',
            lastName: '',
            emailId: '',
            contactNumber1: '',
            gender: '',
            dateOfBirth: '',
            nationality: '',
            workEmail: '',
            joiningDate: '',
            houseNo: '',
            city: '',
            state: '',
            panNumber: '',
            aadharNumber: '',
            passportNumber: '',
            fatherName: '',
            motherName: '',
            maritalStatus: '',
            previousCompanyName: '',
            previousExperience: '',
            department: '',
            designation: '',
            previousCtc: '',
            higherQualification: '',
            bankName: '',
            accountNo: '',
            ifscCode: '',
            bankBranch: '',
            profilePhoto: '',
            imageDir: '',
            document1: '',
            document2: '',
            document3: '',
            basicEmployeeSalary: 0,
            password: ''
        });
        setStep(0);
        localStorage.removeItem('currentStep');

        axios({
            url: `${backendIP}/HRMS/api/employees/register`,
            method: 'post',
            headers: {
                Authorization: token,
                'Content-Type': 'multipart/form-data'
            },
            data: formDataToSend
        }).then(res => {
            console.log('employee data sent successfully', res.data);
            alert("Employee data submitted successfully!");
        }).catch(err => {
            console.log('data not sent', err);
            alert('Employee data not registered');
        });
    };

    const validateStep = (step) => {
        switch (step) {
            case 0: // Basic Details
                return formData.firstName && formData.lastName && formData.emailId && formData.contactNumber1;
            case 1: // Personal Details
                return formData.panNumber && formData.aadharNumber;
            case 2: // Family Details
                return formData.fatherName && formData.motherName;
            case 3: // Experience Details
                return formData.previousCompanyName && formData.department && formData.designation;
            case 4: // Education
                return formData.higherQualification;
            case 5: // Bank Details
                return formData.bankName && formData.accountNo && formData.ifscCode;
            case 6: // Documents (optional to enforce)
                return true;
            case 7: // Salary
                return formData.basicEmployeeSalary;
            case 8: // Password
                return formData.password;
            default:
                return false;
        }
    };


    return (
        <div>
            <h1 className="mb-4">Add Employee</h1>

            {step === 0 && (
                <Card sx={{ padding: '15px', boxShadow: 3 }}>
                    <h5>Basic Details</h5>
                    <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                        <FormControl fullWidth>
                            <InputLabel id="prefix-label">Prefix</InputLabel>
                            <Select labelId="prefix-label" id="prefix" name="prefix" value={formData.prefix} label="Prefix" onChange={handleChange}>
                                <MenuItem value={'mr.'}>Mr.</MenuItem>
                                <MenuItem value={'mrs.'}>Mrs.</MenuItem>
                                <MenuItem value={'miss.'}>Miss</MenuItem>
                                <MenuItem value={'dr.'}>Dr</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField id="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required />
                        <TextField id="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} required />
                        <TextField id="emailId" label="Email ID" value={formData.emailId} onChange={handleChange} required />
                        <TextField id="contactNumber1" label="Contact Number" value={formData.contactNumber1} onChange={handleChange} required />
                        <TextField id="gender" label="Gender" value={formData.gender} onChange={handleChange} />
                        <TextField id="dateOfBirth" type="date" label="Date Of Birth" value={formData.dateOfBirth} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                        <TextField id="nationality" label="Nationality" value={formData.nationality} onChange={handleChange} />
                        <TextField id="workEmail" label="Work Email ID" value={formData.workEmail} onChange={handleChange} />
                        <TextField id="joiningDate" type="date" label="Joining Date" value={formData.joiningDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                        <TextField id="houseNo" label="House Number" value={formData.houseNo} onChange={handleChange} />
                        <TextField id="city" label="City" value={formData.city} onChange={handleChange} />
                        <TextField id="state" label="State" value={formData.state} onChange={handleChange} />
                    </Box>
                </Card>
            )}

            {step === 1 && (
                <Card sx={{ padding: '15px', boxShadow: 3 }}>
                    <h5>Personal Details</h5>
                    <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                        <TextField id="panNumber" label="Pan Number" value={formData.panNumber} onChange={handleChange} />
                        <TextField id="aadharNumber" label="Aadhar Number" value={formData.aadharNumber} onChange={handleChange} />
                        <TextField id="passportNumber" label="Passport Number" value={formData.passportNumber} onChange={handleChange} />
                    </Box>
                </Card>
            )}

            {step === 2 && (
                <Card sx={{ padding: '15px', boxShadow: 3 }}>
                    <h5>Family Details</h5>
                    <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                        <TextField id="fatherName" label="Father's Name" value={formData.fatherName} onChange={handleChange} />
                        <TextField id="motherName" label="Mother's Name" value={formData.motherName} onChange={handleChange} />
                        <TextField id="maritalStatus" label="Marital Status" value={formData.maritalStatus} onChange={handleChange} />
                    </Box>
                </Card>
            )}

            {step === 3 && (
                <Card sx={{ padding: '15px', boxShadow: 3 }}>
                    <h5>Experience Details</h5>
                    <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                        <TextField id="previousCompanyName" label="Previous Company Name" value={formData.previousCompanyName} onChange={handleChange} />
                        <TextField id="previousExperience" label="Years of Experience" value={formData.previousExperience} onChange={handleChange} />
                        <TextField id="department" label="Department" value={formData.department} onChange={handleChange} />
                        <TextField id="designation" label="Designation" value={formData.designation} onChange={handleChange} />
                        <TextField id="previousCtc" label="Previous Ctc" value={formData.previousCtc} onChange={handleChange} />
                    </Box>
                </Card>
            )}

            {step === 4 && (
                <Card sx={{ padding: '15px', boxShadow: 3 }}>
                    <h5>Education</h5>
                    <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                        <TextField id="higherQualification" label="Higher Qualification" value={formData.higherQualification} onChange={handleChange} />
                    </Box>
                </Card>
            )}

            {step === 5 && (
                <Card sx={{ padding: '15px', boxShadow: 3 }}>
                    <h5>Bank Details</h5>
                    <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                        <TextField id="bankName" label="Bank Name" value={formData.bankName} onChange={handleChange} />
                        <TextField id="accountNo" label="Account Number" value={formData.accountNo} onChange={handleChange} />
                        <TextField id="ifscCode" label="IFSC Code" value={formData.ifscCode} onChange={handleChange} />
                        <TextField id="bankBranch" label="Branch Name" value={formData.bankBranch} onChange={handleChange} />
                    </Box>
                </Card>
            )}

            {step === 6 && (
                <Card sx={{ padding: '15px', boxShadow: 3 }}>
                    <h5>Documents</h5>
                    <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                        <Button component="label" id="profilePhoto" variant="contained" startIcon={<CloudUploadIcon />}>
                            Upload Profile Photo
                            <VisuallyHiddenInput type="file" accept="image/*" onChange={(event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    setFormData(prev => ({ ...prev, profilePhoto: file }));
                                }
                            }}
                            />
                        </Button>

                        <Button component="label" id="imageDir" variant="contained" startIcon={<CloudUploadIcon />}>
                            imageDir
                            <VisuallyHiddenInput type="file" accept="image/*" onChange={(event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    setFormData(prev => ({ ...prev, imageDir: file }));
                                }
                            }}
                            />
                        </Button>

                        <Button component="label" id="document1" variant="contained" startIcon={<CloudUploadIcon />}>
                            Upload Document 1
                            <VisuallyHiddenInput type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    setFormData(prev => ({ ...prev, document1: file }));
                                }
                            }}
                            />
                        </Button>

                        <Button component="label" id="document2" variant="contained" startIcon={<CloudUploadIcon />}>
                            Upload Document 2
                            <VisuallyHiddenInput type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    setFormData(prev => ({ ...prev, document2: file }));
                                }
                            }}
                            />
                        </Button>

                        <Button component="label" id="document3" variant="contained" startIcon={<CloudUploadIcon />}>
                            Upload Document 3
                            <VisuallyHiddenInput type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    setFormData(prev => ({ ...prev, document3: file }));
                                }
                            }}
                            />
                        </Button>
                    </Box>
                </Card>
            )}

            {step === 7 && (
                <Card sx={{ padding: '15px', boxShadow: 3 }}>
                    <h5>Basic Salary</h5>
                    <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                        <TextField id="basicEmployeeSalary" label="Salary" value={formData.basicEmployeeSalary} onChange={handleChange} />
                    </Box>
                </Card>
            )}

            {step === 8 && (
                <Card sx={{ padding: '15px', boxShadow: 3 }}>
                    <h5>Credentials</h5>
                    <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                        <TextField id="password" label="Password" value={formData.password} onChange={handleChange} />
                    </Box>
                </Card>
            )}

            <Box sx={{ mt: 2 }}>
                <div className="d-flex justify-content-around">
                    <Button variant="contained" onClick={handleBack} disabled={step === 0} sx={{ px: 5 }}>
                        Back
                    </Button>
                    {step < 8 ? (
                        <Button variant="contained" onClick={handleNext} sx={{ px: 5 }}>Next</Button>
                    ) : (
                        <Button variant="contained" onClick={handleSubmit} sx={{ px: 5 }}>Submit</Button>
                    )}
                </div>
            </Box>
        </div>
    );
};

export default AddEmployee;
