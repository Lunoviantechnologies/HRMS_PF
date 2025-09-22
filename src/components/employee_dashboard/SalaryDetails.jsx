import React, { useState, useRef } from "react";
import { Box, Card, CardContent, Typography, Button, Grid, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Divider, } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; // ✅ Added
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

  // ✅ Ref for capturing payslip card
  const payslipRef = useRef();

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
      const res = await axios.get(`${backendIP}/api/payslip/${employeeId}?month=${month}&year=${year}`, {
        headers : {
          Authorization : token
        }
      }
      );

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
    (salaryData?.epfEmployee || 0) +
    (salaryData?.profTax || 0) +
    (salaryData?.epfEmployer || 0);

  const netPay = salaryData?.monthlySalary
    ? salaryData.monthlySalary - totalDeductions
    : 0;

  // 📄 Download Payslip PDF (screenshot of UI)
  const handleDownloadPayslip = async () => {
    if (!payslipRef.current) return;

    const element = payslipRef.current;

    // ✅ High-quality capture
    const canvas = await html2canvas(element, {
      scale: 4,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // ✅ Only add captured payslip UI (logo + text + tables included)
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight*1.2, undefined, "FAST");

    pdf.save(salaryData.employeeName+ "_" + "Payslip" + "_" + month + ".pdf");
  };

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
        <div ref={payslipRef}>
          <Card
            sx={{
              maxWidth: 800,
              margin: "20px auto",
              borderRadius: "12px",
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "space-between",
                  mb: 2,
                }}
              >
                {/* Left side: Logo */}
                <Box>
                  <img
                    src="/lunovian_logo.png"
                    alt="lunovian_logo"
                    style={{
                      height: "150px",
                      width: "auto",
                      borderRadius: "50%",
                    }}
                  />
                </Box>

                {/* Right side: Company details */}
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Lunovian Technologies Pvt. Ltd.
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    11th Floor, DSL Abacus IT Park, Survey Colony,<br />
                    Industrial Development Area, Uppal, Hyderabad,<br />
                    Telangana - 500039.
                  </Typography>
                </Box>
              </Box>
              <hr />

              <Typography
                variant="h6"
                align="center"
                className="mt-3 fw-bold"
              >
                Payslip for {month} / {year}
              </Typography>

              <Grid container spacing={3} className="mt-3">
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        className="fw-bold mb-2"
                      >
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
                      <Typography
                        variant="subtitle1"
                        className="fw-bold"
                      >
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
                    <TableCell>
                      ₹
                      {grossEarning - salaryData.hra - salaryData.cca - salaryData.conveyance - salaryData.allowance}
                    </TableCell>
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
                    <TableCell className="fw-bold">
                      ₹{salaryData.basicSalary}
                    </TableCell>
                    <TableCell className="fw-bold">Yearly Net</TableCell>
                    <TableCell className="fw-bold">
                      ₹{netPay * 12}
                    </TableCell>
                  </TableRow>
                  <TableRow className="table-success">
                    <TableCell className="fw-bold">CTC</TableCell>
                    <TableCell className="fw-bold">
                      ₹{salaryData.basicSalary}
                    </TableCell>
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
                -- This is a system generated payslip, hence the signature is
                not required. --
              </Typography>
            </CardContent>
          </Card>
        </div>
      )}

      {salaryData && !loading && (
        <Box className="text-center mt-3">
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadPayslip}
          >
            📥 Download Payslip
          </Button>
        </Box>
      )}
    </div>
  );
};

export default SalaryDetails;
