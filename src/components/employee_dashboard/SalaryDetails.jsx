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
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();

  // Fixed values
  const EPF_EMPLOYEE = 1800;
  const EPF_EMPLOYER = 1800;
  const PROFESSIONAL_TAX = 200;

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch salary details
  const fetchSalary = async (employeeId, month, year) => {
    if (!employeeId || !month || !year) {
      setError("Please provide Employee ID, Month, and Year");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${backendIP}/api/payslip/${employeeId}?month=${month}&year=${year}`
      );

      // ✅ Ensure defaults so no field is empty
      setSalaryData({
        ...res.data,
        hra: res.data.hra || 10000,
        cca: res.data.cca || 2500,
        conveyance: res.data.conveyance || 2500,
        allowance: res.data.allowance || 0,
        epfEmployee: EPF_EMPLOYEE,
        epfEmployer: EPF_EMPLOYER,
        profTax: PROFESSIONAL_TAX,
        monthlySalary: (res.data?.basicSalary / 12).toFixed(0),
      });
    } catch (err) {
      console.error("Error fetching salary details:", err);
      setError("No salary details found for the given inputs");
      setSalaryData(null);
    } finally {
      setLoading(false);
    }
  };

  // On form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSalary(formData.employeeId, formData.month, formData.year);
  };

  // ✅ Calculations
  const grossEarning =
    (salaryData?.monthlySalary - salaryData?.hra - salaryData?.cca - salaryData?.conveyance || 0) +
    (salaryData?.hra || 0) +
    (salaryData?.cca || 0) +
    (salaryData?.conveyance || 0) +
    (salaryData?.allowance || 0);

  const totalDeductions =
    (salaryData?.epfEmployee || 0) + (salaryData?.profTax || 0) + (salaryData?.epfEmployer || 0);

  const netPay = salaryData?.monthlySalary ? salaryData.monthlySalary - totalDeductions : 0;

  const yearlyGross = grossEarning;
  const yearlyNet = netPay;
  const ctc = yearlyNet + (salaryData?.epfEmployer || 0);

  // 📄 Download Payslip PDF
  const handleDownloadPayslip = () => {
    if (!salaryData) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Lunovian Technologies Pvt Ltd", 20, 20);
    doc.setFontSize(11);
    doc.text(
      "#1008, 10th Floor, DSL ABACUS IT PARK, Uppal, Hyderabad, TS 500039",
      20,
      28
    );

    doc.setFontSize(14);
    doc.text(
      `Payslip for the Month ${salaryData.monthlySalary}/${salaryData.year}`,
      70,
      40
    );

    doc.setFontSize(11);
    doc.text(`Employee Name: ${salaryData.employeeName || ""}`, 20, 55);
    doc.text(`Job Title: ${salaryData.jobTitle || ""}`, 20, 65);
    doc.text(`Date of Joining: ${salaryData.dateOfJoining || ""}`, 20, 75);
    doc.text(`Pay Period: ${salaryData.payPeriod || ""}`, 20, 85);
    doc.text(`Pay Date: ${salaryData.payDate || ""}`, 20, 95);

    // Earnings & Deductions
    doc.setFontSize(12);
    doc.text("Earnings", 20, 115);
    doc.text("Deductions", 120, 115);

    doc.setFontSize(11);
    doc.text(`Basic: ₹${salaryData.basicSalary || 0}`, 20, 125);
    doc.text(`House Rent Allowance: ₹${salaryData.hra}`, 20, 135);
    doc.text(`City Compensatory Allowance: ₹${salaryData.cca}`, 20, 145);
    doc.text(`Conveyance Allowance: ₹${salaryData.conveyance}`, 20, 155);
    doc.text(`Fixed Allowance: ₹${salaryData.allowance}`, 20, 165);

    doc.text(`EPF (Employee): ₹${EPF_EMPLOYEE}`, 120, 125);
    doc.text(`Professional Tax: ₹${PROFESSIONAL_TAX}`, 120, 135);
    doc.text(`EPF (Employer): ₹${EPF_EMPLOYER}`, 120, 145);

    doc.setFontSize(12);
    doc.text(`Gross Earning (Yearly): ₹${salaryData.basicSalary}`, 20, 185);
    doc.text(`Total Deductions: ₹${totalDeductions}`, 120, 185);
    doc.text(`Yearly Net: ₹${netPay * 12}`, 20, 195);
    doc.text(`CTC: ₹${salaryData.basicSalary}`, 120, 195);

    doc.setFontSize(14);
    doc.text(`Net Pay: ₹${netPay}`, 20, 220);

    doc.setFontSize(9);
    doc.text(
      "This is a system generated payslip, hence the signature is not required.",
      20,
      240
    );

    doc.save("Payslip.pdf");
  };

  // inside return()
  return (
    <div>
      {/* Search Form */}
      <Box component="form" onSubmit={handleSubmit} p={2}>
        <Grid container spacing={2} alignItems="center">
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

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
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

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Get Payslip
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Loader */}
      {loading && (
        <Typography align="center" sx={{ mt: 2 }}>
          Loading salary details...
        </Typography>
      )}

      {/* Error */}
      {error && !loading && (
        <Typography align="center" sx={{ mt: 2, color: "red" }}>
          {error}
        </Typography>
      )}

      {/* Payslip Card */}
      {salaryData && !loading && (
        <Card
          sx={{
            maxWidth: 800,
            margin: "20px auto",
            borderRadius: "12px",
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Typography variant="h5" className="fw-bold">
              <img src="/lunovian_logo.png" alt="lunovian_logo" style={{ height: '60px', width: '60px', borderRadius: '50%', backgroundColor: 'black'}}/>
              Lunovian Technologies Pvt Ltd
            </Typography>
            <Typography variant="body2" color="textSecondary">
              #1008, 10th Floor, DSL ABACUS IT PARK, Uppal, Hyderabad, TS 500039
            </Typography>

            <Typography variant="h6" align="center" className="mt-3 fw-bold">
              Payslip for {month} / {year}
            </Typography>

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
                      ₹{netPay}
                    </Typography>
                    <Typography variant="body2">
                      Paid days: {salaryData.paidDays} | LOP days:{" "}
                      {salaryData.lopDays}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Earnings & Deductions */}
            <Table className="table-bordered mt-4">
              <TableHead className="table-light">
                <TableRow>
                  <TableCell className="fw-bold">Earnings</TableCell>
                  <TableCell className="fw-bold">MonthlyAmount</TableCell>
                  <TableCell className="fw-bold">MonthlyDeductions</TableCell>
                  <TableCell className="fw-bold">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Basic</TableCell>
                  <TableCell>₹{grossEarning - salaryData.hra - salaryData.cca - salaryData.conveyance - salaryData.allowance}</TableCell>
                  <TableCell>EPF (Employee)</TableCell>
                  <TableCell>₹{EPF_EMPLOYEE}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>House rent allowance</TableCell>
                  <TableCell>₹{salaryData.hra}</TableCell>
                  <TableCell>Professional Tax</TableCell>
                  <TableCell>₹{PROFESSIONAL_TAX}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>City compensatory allowance</TableCell>
                  <TableCell>₹{salaryData.cca}</TableCell>
                  <TableCell>EPF (Employer)</TableCell>
                  <TableCell>₹{EPF_EMPLOYER}</TableCell>
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
                <TableRow className="table-warning">
                  <TableCell colSpan={4} className="fw-bold">
                    Gross Salary ₹{grossEarning}
                  </TableCell>
                </TableRow>
                <TableRow className="table-warning">
                  <TableCell colSpan={4} className="fw-bold">
                    Total Deduction Payable ₹{totalDeductions * 12}
                  </TableCell>
                </TableRow>
                <TableRow className="table-info">
                  <TableCell className="fw-bold">Yearly Gross</TableCell>
                  <TableCell className="fw-bold">₹{salaryData.basicSalary} </TableCell>
                  <TableCell className="fw-bold">Yearly Net</TableCell>
                  <TableCell className="fw-bold">₹{netPay * 12}</TableCell>
                </TableRow>
                <TableRow className="table-success">
                  <TableCell className="fw-bold">CTC</TableCell>
                  <TableCell className="fw-bold">₹{salaryData.basicSalary}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Divider className="my-3" />

            <Typography
              variant="caption"
              align="center"
              display="block"
              color="textSecondary"
            >
              -- This is a system generated payslip, hence the signature is not
              required. --
            </Typography>

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
