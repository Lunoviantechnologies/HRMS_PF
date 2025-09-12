import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button, Grid, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Divider } from "@mui/material";
import jsPDF from "jspdf";
import axios from "axios";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

const SalaryDetails = () => {
  const { token, user } = useAuth();
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    year: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { employeeId, month, year } = formData;

    axios
      .get(`${backendIP}/api/payslip/${employeeId}?month=${month}&year=${year}`, {
        // headers: { Authorization: token }
      })
      .then((res) => {
        setSalaryData(res.data);
        console.log("fetching salary details:", res.data);
      })
      .catch((err) => {
        console.error("Error fetching salary details:", err);
        setError("Failed to load salary details");
        setSalaryData(null);
      })
      .finally(() => setLoading(false));
  };

  // Example backend response (make sure backend matches this shape)
  const defaultData = {
    employeeName: "Employee",
    jobTitle: "Software Engineer",
    dateOfJoining: "2025-01-01",
    payPeriod: "May 1, 2025 to May 31, 2025",
    payDate: "June 6, 2025",
    basic: 15000,
    hra: 5250,
    cca: 2500,
    conveyance: 2500,
    allowance: 2800,
    epf: 1800,
    grossEarning: 28050,
    netPay: 26250,
    paidDays: 31,
    lopDays: 0,
  };

  const {
    employeeName,
    jobTitle,
    dateOfJoining,
    payPeriod,
    payDate,
    basic,
    hra,
    cca,
    conveyance,
    allowance,
    epf,
    grossEarning,
    netPay,
    paidDays,
    lopDays,
  } = salaryData || defaultData;

  // 📄 Generate Payslip PDF
  const handleDownloadPayslip = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Lunovian Technologies Pvt Ltd", 20, 20);
    doc.setFontSize(11);
    doc.text("#1008, 10th Floor, DSL ABACUS IT PARK, Uppal, Hyderabad, TS 500039", 20, 28);

    doc.setFontSize(14);
    doc.text("Payslip for the Month May 2025", 70, 40);

    // Employee Info
    doc.setFontSize(11);
    doc.text(`Employee Name: ${employeeName}`, 20, 55);
    doc.text(`Job Title: ${jobTitle}`, 20, 65);
    doc.text(`Date of Joining: ${dateOfJoining}`, 20, 75);
    doc.text(`Pay Period: ${payPeriod}`, 20, 85);
    doc.text(`Pay Date: ${payDate}`, 20, 95);

    // Earnings & Deductions
    doc.setFontSize(12);
    doc.text("Earnings", 20, 115);
    doc.text("Deductions", 120, 115);

    doc.setFontSize(11);
    doc.text(`Basic: ₹${basic}`, 20, 125);
    doc.text(`House Rent Allowance: ₹${hra}`, 20, 135);
    doc.text(`City Compensatory Allowance: ₹${cca}`, 20, 145);
    doc.text(`Conveyance Allowance: ₹${conveyance}`, 20, 155);
    doc.text(`Fixed Allowance: ₹${allowance}`, 20, 165);

    doc.text(`EPF Contribution: ₹${epf}`, 120, 125);

    // Summary
    doc.setFontSize(12);
    doc.text(`Gross Earning: ₹${grossEarning}`, 20, 185);
    doc.text(`Total Deductions: ₹${epf}`, 120, 185);

    doc.setFontSize(14);
    doc.text(`Net Pay: ₹${netPay}`, 20, 205);

    doc.setFontSize(11);
    doc.text(`Paid Days: ${paidDays} | LOP Days: ${lopDays}`, 20, 220);

    doc.setFontSize(9);
    doc.text("This is a system generated payslip, hence the signature is not required.", 20, 240);

    doc.save("Payslip.pdf");
  };

  // inside return()
  return (
    <div>
      {/* Step 1: Show form */}
      <Box component="form" onSubmit={handleSubmit} p={2}>
        <Grid container spacing={2} alignItems="center">
          {/* Employee ID */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Month - wider */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
              sx={{ minWidth: 100 }}
            >
              {[...Array(12)].map((_, index) => {
                const monthNumber = index + 1;
                return (
                  <MenuItem key={monthNumber} value={monthNumber}>
                    {monthNumber.toString().padStart(2, "0")}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>

          {/* Year */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              required
              inputProps={{ min: 2000, max: 2100 }}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Get Payslip
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Step 2: Loading message */}
      {loading && (
        <Typography align="center" sx={{ mt: 2 }}>
          Loading salary details...
        </Typography>
      )}

      {/* Show error if API failed */}
      {error && !loading && (
        <Typography align="center" sx={{ mt: 2, color: "red" }}>
          {error}
        </Typography>
      )}

      {/* Show Payslip only after API success */}
      {salaryData && !loading && (
        <Card sx={{ maxWidth: 800, margin: "20px auto", borderRadius: "12px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" className="fw-bold">
              Lunovian Technologies Pvt Ltd
            </Typography>
            <Typography variant="body2" color="textSecondary">
              #1008, 10th Floor, DSL ABACUS IT PARK, Uppal, Hyderabad, TS 500039
            </Typography>

            {/* Title */}
            <Typography variant="h6" align="center" className="mt-3 fw-bold">
              Payslip for the month of {salaryData.month}, {salaryData.year}
            </Typography>

            {/* Employee Info + Net Pay */}
            <Grid container spacing={3} className="mt-3">
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" className="fw-bold mb-2">
                      Pay Summary
                    </Typography>
                    <Typography variant="body2">
                      Employee name: <b>{salaryData.employeeName}</b>
                    </Typography>
                    <Typography variant="body2">
                      Job title: {salaryData.jobTitle}
                    </Typography>
                    <Typography variant="body2">
                      Date of joining: {salaryData.dateOfJoining}
                    </Typography>
                    <Typography variant="body2">
                      Pay period: {salaryData.payPeriod}
                    </Typography>
                    <Typography variant="body2">
                      Pay date: {salaryData.payDate}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" className="bg-light text-center">
                  <CardContent>
                    <Typography variant="subtitle1" className="fw-bold">
                      Employee Net Pay
                    </Typography>
                    <Typography
                      variant="h5"
                      color="success.main"
                      className="fw-bold"
                    >
                      ₹{salaryData.netPay}
                    </Typography>
                    <Typography variant="body2">
                      Paid days: {salaryData.paidDays} | LOP days:{" "}
                      {salaryData.lopDays}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Earnings + Deductions Table */}
            <Table className="table-bordered mt-4">
              <TableHead className="table-light">
                <TableRow>
                  <TableCell className="fw-bold">Earnings</TableCell>
                  <TableCell className="fw-bold">Amount</TableCell>
                  <TableCell className="fw-bold">Deductions</TableCell>
                  <TableCell className="fw-bold">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Basic</TableCell>
                  <TableCell>₹{salaryData.basicSalary}</TableCell>
                  <TableCell>EPF Contribution</TableCell>
                  <TableCell>₹{salaryData.epf}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>House rent allowance</TableCell>
                  <TableCell>₹{salaryData.hra}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>City compensatory allowance</TableCell>
                  <TableCell>₹{salaryData.cca}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Conveyance allowance</TableCell>
                  <TableCell>₹{salaryData.conveyance}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fixed allowance</TableCell>
                  <TableCell>₹{salaryData.allowance}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="fw-bold">Gross earning</TableCell>
                  <TableCell className="fw-bold">
                    ₹{salaryData.grossEarning}
                  </TableCell>
                  <TableCell className="fw-bold">Total deductions</TableCell>
                  <TableCell className="fw-bold">₹{salaryData.epf}</TableCell>
                </TableRow>
                <TableRow className="table-warning">
                  <TableCell colSpan={4} className="fw-bold">
                    Total Net Payable ₹{salaryData.netPay} (
                    {salaryData.netPayWords})
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Divider className="my-3" />

            {/* Footer Note */}
            <Typography
              variant="caption"
              align="center"
              display="block"
              color="textSecondary"
            >
              -- This is a system generated payslip, hence the signature is not
              required. --
            </Typography>

            {/* Download Button */}
            <Box className="text-center mt-3">
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownloadPayslip}
              >
                📥 Download Payslip
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  );

};

export default SalaryDetails;
