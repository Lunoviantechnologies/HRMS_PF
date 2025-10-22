// src/components/admin_dashboard/SalaryDashboard.jsx
import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Divider, } from "@mui/material";
import axios from "axios";
import backendIP from "../../api";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer, } from "recharts";
import { useAuth } from "../../context/AuthContext";

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#d32f2f"];

const SalaryDashboard = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${backendIP}/api/employees/all`, {
        headers: {
          Authorization: token
        }
      })
      .then((res) => {
        // console.log("Employees API Response:", res.data); // ✅ Debug
        setEmployees(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  // --- Salary field handling ---
  const getSalary = (emp) => {
    if (emp.salary) return Number(emp.salary); // already monthly
    if (emp.monthlySalary) return Number(emp.monthlySalary);
    if (emp.basicEmployeeSalary) return Math.round(emp.basicEmployeeSalary / 12);
    return 0;
  };

  // --- Salary Calculations ---
  const totalEmployees = employees.length;
  const totalSalary = employees.reduce((sum, emp) => sum + getSalary(emp), 0);
  const monthlyRevenue = totalSalary;
  const yearlyRevenue = monthlyRevenue * 12;

  // --- Pie Chart Data ---
  const chartData = [
    { name: "Monthly Salary (₹)", value: monthlyRevenue },
    { name: "Yearly Revenue (₹)", value: yearlyRevenue },
    { name: "Total Employees", value: totalEmployees },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        💼Salary Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderLeft: "5px solid #1976d2" }}>
            <CardContent>
              <Typography color="textSecondary">Total Employees</Typography>
              <Typography variant="h5" fontWeight="bold">
                {totalEmployees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderLeft: "5px solid #2e7d32" }}>
            <CardContent>
              <Typography color="textSecondary">
                Monthly Salary Payout
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                ₹ {monthlyRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderLeft: "5px solid #ed6c02" }}>
            <CardContent>
              <Typography color="textSecondary">Yearly Revenue</Typography>
              <Typography variant="h5" fontWeight="bold">
                ₹ {yearlyRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Employee Salary Table */}
      <Card sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            👨‍💼 Employees Salary List
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>#</b>
                </TableCell>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Department</b>
                </TableCell>
                <TableCell align="right">
                  <b>Salary (₹)</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{emp.firstName}</TableCell>
                  <TableCell>{emp.department || "N/A"}</TableCell>
                  <TableCell align="right">
                    ₹ {getSalary(emp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Salary Pie Chart */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Salary & Revenue Overview
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box height={350}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SalaryDashboard;
