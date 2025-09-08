import React, { useState } from "react";
import { Card, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import axios from "axios";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";
import FaceCapture from "./FaceCapture";
import { useFormikContext } from "formik";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

// 🔹 Yup Schemas for each step
const validationSchemas = [
    // Step 0: Basic Details
    Yup.object({
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        emailId: Yup.string().email("Invalid email").required("Email is required"),
        contactNumber1: Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits").min(10, "Must be at least 10 digits").required("Contact number is required"),
    }),
    // Step 1: Personal Details
    Yup.object({
        panNumber: Yup.string().required("PAN number is required"),
        aadharNumber: Yup.string()
            .matches(/^[0-9]{12}$/, "Must be 12 digits")
            .required("Aadhar is required"),
    }),
    // Step 2: Family Details
    Yup.object({
        fatherName: Yup.string().required("Father's name is required"),
        motherName: Yup.string().required("Mother's name is required"),
    }),
    // Step 3: Experience
    Yup.object({
        previousCompanyName: Yup.string().required("Company name required"),
        department: Yup.string().required("Department required"),
        designation: Yup.string().required("Designation required"),
    }),
    // Step 4: Education
    Yup.object({
        higherQualification: Yup.string().required("Qualification required"),
    }),
    // Step 5: Bank Details
    Yup.object({
        bankName: Yup.string().required("Bank name required"),
        accountNo: Yup.string().required("Account number required"),
        ifscCode: Yup.string().required("IFSC required"),
    }),
    // Step 6: Documents (optional → no validation)
    Yup.object({}),
    // Step 7: Salary
    Yup.object({
        basicEmployeeSalary: Yup.number()
            .positive("Must be positive")
            .required("Salary is required"),
    }),
    // Step 8: Credentials
    Yup.object({
        password: Yup.string()
            .min(6, "At least 6 characters")
            .required("Password is required"),
    }),
];

// 🔹 Initial Values
const initialValues = {
    prefix: "",
    firstName: "",
    lastName: "",
    emailId: "",
    contactNumber1: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    workEmail: "",
    joiningDate: "",
    houseNo: "",
    city: "",
    state: "",
    panNumber: "",
    aadharNumber: "",
    passportNumber: "",
    fatherName: "",
    motherName: "",
    maritalStatus: "",
    previousCompanyName: "",
    previousExperience: "",
    department: "",
    designation: "",
    previousCtc: "",
    higherQualification: "",
    bankName: "",
    accountNo: "",
    ifscCode: "",
    bankBranch: "",
    basicEmployeeSalary: "",
    password: "",
    imageDir: [],
    profilePhoto: null,
    document1: null,
    document2: null,
    document3: null,
};

const AddEmployee = () => {
    const { token } = useAuth();
    const [step, setStep] = useState(0);

    const handleFileChange = (setFieldValue, field, multiple = false) => (e) => {
        if (multiple) {
            setFieldValue(field, Array.from(e.target.files));
        } else {
            setFieldValue(field, e.target.files[0]);
        }
    };

    // validate firstname + lastname together
    const checkNameCombination = async (lastName, values) => {
        console.log(values.firstName, lastName);
        if (!lastName) return "Last name is required";
        try {
            const res = await axios.get(`${backendIP}/api/employees/check-name?firstName=${values.firstName}&lastName=${lastName}`);
            console.log(res.data.isUnique);
            if (res.data.isUnique) {
                return "This first + last name already exists";
            }
        } catch (err) {
            console.error(err);
            return "Error verifying name";
        }
    };

    // validate email for uniqueness
    const checkEmail = async (value) => {
        if (!value) return "Email is required";
        try {
            const res = await axios.post(`${backendIP}/api/employees/check-email`, {
                emailId: value,
            });
            if (res.data.exists) {
                return "Email already exists";
            }
        } catch (err) {
            console.error(err);
            return "Error verifying email";
        }
    };

    const handleSubmitForm = async (values, { resetForm }) => {
        console.log("Response:", values);
        try {
            const formDataToSend = new FormData();
            Object.keys(values).forEach((key) => {
                if (
                    !["imageDir", "profilePhoto", "document1", "document2", "document3"].includes(key)
                ) {
                    formDataToSend.append(key, values[key]);
                }
            });

            if (values.imageDir?.length) {
                values.imageDir.forEach((file) => formDataToSend.append("imageDir", file));
            }
            if (values.profilePhoto) formDataToSend.append("profilePhoto", values.profilePhoto);
            if (values.document1) formDataToSend.append("document1", values.document1);
            if (values.document2) formDataToSend.append("document2", values.document2);
            if (values.document3) formDataToSend.append("document3", values.document3);

            const res = await axios.post(`${backendIP}/api/employees/register`, formDataToSend, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Employee registered successfully!");
            console.log("Response:", res.data);
        } catch (err) {
            console.error("Error:", err);
            alert("Failed to register employee.");
        }

        resetForm();
        setStep(0);
    };

    return (
        <div>
            <h1 className="mb-4">Add Employee</h1>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchemas[step]}
                onSubmit={(values, { resetForm }) => handleSubmitForm(values, { resetForm })}
            >
                {({ setFieldValue, errors, touched, values }) => (
                    <Form>
                        {/* 🔹 Step 0 */}
                        {step === 0 && (
                            <Card sx={{ padding: "15px", boxShadow: 3 }}>
                                <h5>Basic Details</h5>
                                <Box sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="prefix-label">Prefix</InputLabel>
                                        <Field
                                            as={Select}
                                            labelId="prefix-label"
                                            name="prefix"
                                            label="Prefix"
                                        >
                                            <MenuItem value="mr.">Mr.</MenuItem>
                                            <MenuItem value="mrs.">Mrs.</MenuItem>
                                            <MenuItem value="miss.">Miss</MenuItem>
                                            <MenuItem value="dr.">Dr</MenuItem>
                                        </Field>
                                    </FormControl>

                                    <Field
                                        as={TextField}
                                        name="firstName"
                                        label="First Name"
                                        helperText={<ErrorMessage name="firstName" />}
                                    />
                                    <Field name="lastName" validate={(val) => checkNameCombination(val, values)}>
                                        {({ field, meta }) => (
                                            <TextField
                                                {...field}
                                                label="Last Name"
                                                error={meta.touched && Boolean(meta.error)}
                                                helperText={meta.touched && meta.error}
                                            />
                                        )}
                                    </Field>
                                    <Field name="emailId" validate={checkEmail}>
                                        {({ field, meta }) => (
                                            <TextField
                                                {...field}
                                                label="Email ID"
                                                error={meta.touched && Boolean(meta.error)}
                                                helperText={meta.touched && meta.error}
                                            />
                                        )}
                                    </Field>
                                    <Field
                                        as={TextField}
                                        name="contactNumber1"
                                        label="Contact Number"
                                        error={touched.contactNumber1 && Boolean(errors.contactNumber1)}
                                        helperText={<ErrorMessage name="contactNumber1" />}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel id="gender-label">Gender</InputLabel>
                                        <Field
                                            as={Select}
                                            labelId="gender-label"
                                            name="gender"
                                            label="Gender"
                                            error={touched.gender && Boolean(errors.gender)}
                                            helperText={<ErrorMessage name="gender" />}
                                        >
                                            <MenuItem value="Male">Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </Field>
                                    </FormControl>
                                    <Field
                                        as={TextField}
                                        type="date"
                                        name="dateOfBirth"
                                        label="Date Of Birth"
                                        InputLabelProps={{ shrink: true }}
                                        error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                                        helperText={<ErrorMessage name="dateOfBirth" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="nationality"
                                        label="Nationality"
                                        error={touched.nationality && Boolean(errors.nationality)}
                                        helperText={<ErrorMessage name="nationality" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="workEmail"
                                        label="Work Email"
                                        error={touched.workEmail && Boolean(errors.workEmail)}
                                        helperText={<ErrorMessage name="workEmail" />}
                                    />
                                    <Field
                                        as={TextField}
                                        type="date"
                                        name="joiningDate"
                                        label="Joining Date"
                                        InputLabelProps={{ shrink: true }}
                                        error={touched.joiningDate && Boolean(errors.joiningDate)}
                                        helperText={<ErrorMessage name="joiningDate" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="houseNo"
                                        label="House Number"
                                        error={touched.houseNo && Boolean(errors.houseNo)}
                                        helperText={<ErrorMessage name="houseNo" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="city"
                                        label="City"
                                        error={touched.city && Boolean(errors.city)}
                                        helperText={<ErrorMessage name="city" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="state"
                                        label="State"
                                        error={touched.state && Boolean(errors.state)}
                                        helperText={<ErrorMessage name="state" />}
                                    />
                                </Box>
                            </Card>
                        )}

                        {/* 🔹 Step 1 */}
                        {step === 1 && (
                            <Card sx={{ padding: "15px", boxShadow: 3 }}>
                                <h5>Personal Details</h5>
                                <Box sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}>
                                    <Field
                                        as={TextField}
                                        name="panNumber"
                                        label="PAN Number"
                                        error={touched.panNumber && Boolean(errors.panNumber)}
                                        helperText={<ErrorMessage name="panNumber" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="aadharNumber"
                                        label="Aadhar Number"
                                        error={touched.aadharNumber && Boolean(errors.aadharNumber)}
                                        helperText={<ErrorMessage name="aadharNumber" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="passportNumber"
                                        label="Passport Number"
                                        error={touched.passportNumber && Boolean(errors.passportNumber)}
                                        helperText={<ErrorMessage name="passportNumber" />}
                                    />
                                </Box>
                            </Card>
                        )}

                        {/* 🔹 Step 2 */}
                        {step === 2 && (
                            <Card sx={{ padding: "15px", boxShadow: 3 }}>
                                <h5>Family Details</h5>
                                <Box sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}>
                                    <Field
                                        as={TextField}
                                        name="fatherName"
                                        label="Father's Name"
                                        error={touched.fatherName && Boolean(errors.fatherName)}
                                        helperText={<ErrorMessage name="fatherName" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="motherName"
                                        label="Mother's Name"
                                        error={touched.motherName && Boolean(errors.motherName)}
                                        helperText={<ErrorMessage name="motherName" />}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel id="maritalStatus-label">Marital Status</InputLabel>
                                        <Field
                                            as={Select}
                                            labelId="maritalStatus-label"
                                            name="maritalStatus"
                                            label="Marital Status"
                                            error={touched.maritalStatus && Boolean(errors.maritalStatus)}
                                            helperText={<ErrorMessage name="maritalStatus" />}
                                        >
                                            <MenuItem value="Single">Single</MenuItem>
                                            <MenuItem value="Married">Married</MenuItem>
                                            <MenuItem value="Divorced">Divorced</MenuItem>
                                            <MenuItem value="Widowed">Widowed</MenuItem>
                                        </Field>
                                    </FormControl>
                                </Box>
                            </Card>
                        )}

                        {step === 3 && (
                            <Card sx={{ padding: '15px', boxShadow: 3 }}>
                                <h5>Experience Details</h5>
                                <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                                    <Field
                                        as={TextField}
                                        name="previousCompanyName"
                                        label="Previous Company Name"
                                        error={touched.previousCompanyName && Boolean(errors.previousCompanyName)}
                                        helperText={<ErrorMessage name="previousCompanyName" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="previousExperience"
                                        label="Previous Experience"
                                        error={touched.previousExperience && Boolean(errors.previousExperience)}
                                        helperText={<ErrorMessage name="previousExperience" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="department"
                                        label="Department"
                                        error={touched.department && Boolean(errors.department)}
                                        helperText={<ErrorMessage name="department" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="designation"
                                        label="Designation"
                                        error={touched.designation && Boolean(errors.designation)}
                                        helperText={<ErrorMessage name="designation" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="previousCtc"
                                        label="Previous Ctc"
                                        error={touched.previousCtc && Boolean(errors.previousCtc)}
                                        helperText={<ErrorMessage name="previousCtc" />}
                                    />
                                </Box>
                            </Card>
                        )}

                        {step === 4 && (
                            <Card sx={{ padding: '15px', boxShadow: 3 }}>
                                <h5>Education</h5>
                                <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                                    <Field
                                        as={TextField}
                                        name="higherQualification"
                                        label="Higher Qualification"
                                        error={touched.higherQualification && Boolean(errors.higherQualification)}
                                        helperText={<ErrorMessage name="higherQualification" />}
                                    />
                                </Box>
                            </Card>
                        )}

                        {step === 5 && (
                            <Card sx={{ padding: '15px', boxShadow: 3 }}>
                                <h5>Bank Details</h5>
                                <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                                    <Field
                                        as={TextField}
                                        name="bankName"
                                        label="Bank Name"
                                        error={touched.bankName && Boolean(errors.bankName)}
                                        helperText={<ErrorMessage name="bankName" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="accountNo"
                                        label="Account Number"
                                        error={touched.accountNo && Boolean(errors.accountNo)}
                                        helperText={<ErrorMessage name="accountNo" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="ifscCode"
                                        label="ifsc Code"
                                        error={touched.ifscCode && Boolean(errors.ifscCode)}
                                        helperText={<ErrorMessage name="ifscCode" />}
                                    />
                                    <Field
                                        as={TextField}
                                        name="bankBranch"
                                        label="Bank Branch"
                                        error={touched.bankBranch && Boolean(errors.bankBranch)}
                                        helperText={<ErrorMessage name="bankBranch" />}
                                    />
                                </Box>
                            </Card>
                        )}

                        {step === 6 && (
                            <Card sx={{ padding: '15px', boxShadow: 3 }}>
                                <h5>Documents</h5>
                                <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>

                                    {/* Profile Photo */}
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload Profile Photo
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];
                                                if (file) {
                                                    setFieldValue("profilePhoto", file);
                                                }
                                            }}
                                        />
                                    </Button>
                                    {touched.profilePhoto && errors.profilePhoto && (
                                        <div style={{ color: "red", fontSize: "12px" }}>{errors.profilePhoto}</div>
                                    )}

                                    {/* Document 1 */}
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload Document 1
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];
                                                if (file) {
                                                    setFieldValue("document1", file);
                                                }
                                            }}
                                        />
                                    </Button>
                                    {touched.document1 && errors.document1 && (
                                        <div style={{ color: "red", fontSize: "12px" }}>{errors.document1}</div>
                                    )}

                                    {/* Document 2 */}
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload Document 2
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];
                                                if (file) {
                                                    setFieldValue("document2", file);
                                                }
                                            }}
                                        />
                                    </Button>

                                    {/* Document 3 */}
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload Document 3
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];
                                                if (file) {
                                                    setFieldValue("document3", file);
                                                }
                                            }}
                                        />
                                    </Button>

                                    {/* Face Images */}
                                    <FaceCapture setFieldValue={setFieldValue} />

                                    {/* Optional error display */}
                                    {touched.imageDir && errors.imageDir && (
                                        <div style={{ color: "red", fontSize: "12px" }}>{errors.imageDir}</div>
                                    )}
                                </Box>
                            </Card>
                        )}

                        {step === 7 && (
                            <Card sx={{ padding: '15px', boxShadow: 3 }}>
                                <h5>Basic Salary</h5>
                                <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                                    <Field
                                        as={TextField}
                                        name="basicEmployeeSalary"
                                        label="Employee Salary"
                                        error={touched.basicEmployeeSalary && Boolean(errors.basicEmployeeSalary)}
                                        helperText={<ErrorMessage name="basicEmployeeSalary" />}
                                    />
                                </Box>
                            </Card>
                        )}

                        {step === 8 && (
                            <Card sx={{ padding: '15px', boxShadow: 3 }}>
                                <h5>Credentials</h5>
                                <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                                    <Field
                                        as={TextField}
                                        name="password"
                                        label="Password"
                                        error={touched.password && Boolean(errors.password)}
                                        helperText={<ErrorMessage name="password" />}
                                    />
                                </Box>
                            </Card>
                        )}

                        {/* 🔹 Navigation Buttons */}
                        <Box sx={{ mt: 2 }} className="d-flex justify-content-around">
                            <Button
                                variant="contained"
                                type="button"
                                onClick={() => setStep((s) => s - 1)}
                                disabled={step === 0}
                            >
                                Back
                            </Button>

                            {step < validationSchemas.length - 1 ? (
                                <Button
                                    variant="contained"
                                    type="button"
                                    onClick={() => setStep((s) => s + 1)}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button variant="contained" type="submit">
                                    Submit
                                </Button>
                            )}
                        </Box>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddEmployee;