// src/components/admin_dashboard/EmployeeSalary.jsx
import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, CircularProgress,} from "@mui/material";
import axios from "axios";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

const EmployeeSalary = () => {
  const { token } = useAuth(); // ✅ get token from AuthContext
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${backendIP}/api/employees/all`, {
          headers: {
            Authorization: token.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`, // ✅ ensure no double Bearer
          },
        });
        console.log("Employee Salary API Response:", res.data);
        setEmployees(res.data || []);
        setFiltered(res.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [token]);

  // 🔍 Search employees
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filteredData = employees.filter(
      (emp) =>
        emp.name?.toLowerCase().includes(value) ||
        emp.department?.toLowerCase().includes(value)
    );
    setFiltered(filteredData);
  };

  // 💰 Get salary safely
  const getSalary = (emp) =>
    {emp.salary || emp.basicSalary || emp.monthlySalary || 0
      console.log(emp)
    };

  // 📅 Format joining date
  const getJoiningDate = (emp) => {
    if (!emp.joiningDate) return "N/A";
    return new Date(emp.joiningDate).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
         Employee Salaries
      </Typography>

      {/* 🔍 Search Bar */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by Name or Department..."
            value={search}
            onChange={handleSearch}
          />
        </CardContent>
      </Card>

      {/* 📊 Salary Table */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><b>#</b></TableCell>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Joining Date</b></TableCell>
                  <TableCell><b>Department</b></TableCell>
                  <TableCell align="right"><b>Package (₹)</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((emp, index) => (
                    <TableRow key={emp.id || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{emp.firstName + ' ' + emp.lastName}</TableCell>
                      <TableCell>{getJoiningDate(emp)}</TableCell>
                      <TableCell>{emp.department || "N/A"}</TableCell>
                      <TableCell align="right">
                        ₹ {getSalary(emp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No employees found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeSalary;
