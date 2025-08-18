import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import jsPDF from "jspdf";
import axios from "axios";
import backendIP from "../../api";

const SalaryDetails = () => {
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("loggedUser"));

        const response = await axios.get(
          `${backendIP}/HRMS/employee/salary/${user.employeeId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        setSalaryData(response.data);
      } catch (error) {
        console.error("Error fetching salary details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, []);

  if (loading) {
    return (
      <Card sx={{ maxWidth: 800, margin: "20px auto", borderRadius: "12px", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" align="center">Loading salary details...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!salaryData) {
    return (
      <Card sx={{ maxWidth: 800, margin: "20px auto", borderRadius: "12px", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" color="error" align="center">Failed to load salary details</Typography>
        </CardContent>
      </Card>
    );
  }

  // Example backend response (make sure backend matches this shape)
  const {
    employeeName = "Employee",
    jobTitle = "Software Engineer",
    dateOfJoining = "2025-01-01",
    payPeriod = "May 1, 2025 to May 31, 2025",
    payDate = "June 6, 2025",
    basic = 15000,
    hra = 5250,
    cca = 2500,
    conveyance = 2500,
    allowance = 2800,
    epf = 1800,
    grossEarning = 28050,
    netPay = 26250,
    paidDays = 31,
    lopDays = 0,
  } = salaryData;

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

  return (
    <Card sx={{ maxWidth: 800, margin: "20px auto", borderRadius: "12px", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>💼 Employee Payslip</Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}><Typography><b>Employee:</b> {employeeName}</Typography></Grid>
          <Grid item xs={6}><Typography><b>Job Title:</b> {jobTitle}</Typography></Grid>
          <Grid item xs={6}><Typography><b>Joining Date:</b> {dateOfJoining}</Typography></Grid>
          <Grid item xs={6}><Typography><b>Pay Period:</b> {payPeriod}</Typography></Grid>
          <Grid item xs={6}><Typography><b>Pay Date:</b> {payDate}</Typography></Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 3 }}>Earnings</Typography>
        <Typography>Basic: ₹{basic}</Typography>
        <Typography>HRA: ₹{hra}</Typography>
        <Typography>CCA: ₹{cca}</Typography>
        <Typography>Conveyance: ₹{conveyance}</Typography>
        <Typography>Fixed Allowance: ₹{allowance}</Typography>

        <Typography variant="h6" sx={{ mt: 3 }}>Deductions</Typography>
        <Typography>EPF Contribution: ₹{epf}</Typography>

        <Typography variant="h6" sx={{ mt: 3 }}>Summary</Typography>
        <Typography>Gross Earning: ₹{grossEarning}</Typography>
        <Typography>Total Deductions: ₹{epf}</Typography>
        <Typography variant="h6">Net Pay: ₹{netPay}</Typography>
        <Typography>Paid Days: {paidDays} | LOP Days: {lopDays}</Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
          onClick={handleDownloadPayslip}
        >
          📥 Download Payslip
        </Button>
      </CardContent>
    </Card>
  );
};

export default SalaryDetails;
