import React, { useEffect, useState } from "react";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Typography,} from "@mui/material";

const PreviousEmployees = () => {
    const { token } = useAuth();
    const [previousEmpList, setPreviousEmpList] = useState([]); 

    useEffect(() => {
        axios
            .get(`${backendIP}/HRMS/api/employees/archieved_employees`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                console.log(res.data);
                setPreviousEmpList(res.data);
            })
            .catch((err) => console.error(err));
    }, [token]);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Previous Employees List
            </Typography>

            <TableContainer component={Paper} className="shadow-lg">
                <Table>
                    <TableHead style={{backgroundColor : '#0385acff'}}>
                        <TableRow>
                            {[
                                "Employee ID",
                                "Profile",
                                "First Name",
                                "Last Name",
                                "Email",
                                "Department",
                                "Designation",
                                "Contact Number",
                                "Date of Birth",
                                "Joining Date",
                                "Resigned Date",
                            ].map((head) => (
                                <TableCell
                                    key={head}
                                    sx={{ fontWeight: "bold", border: "1px solid #ddd", color : "white" }}
                                >
                                    {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {previousEmpList.map((emp) => (
                            <TableRow key={emp.archiveId}>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                    {emp.originalEmployeeId}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                    {emp.profilePhoto ? (
                                        <Avatar src={emp.profilePhoto} alt={emp.firstName} />
                                    ) : (
                                        <Avatar>{emp.firstName?.charAt(0)}</Avatar>
                                    )}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                    {emp.firstName}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                    {emp.lastName}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                    {emp.emailId}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                    {emp.department || "-"}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                    {emp.designation || "-"}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                    {emp.contactNumber1 || "-"}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                    {emp.dateOfBirth
                                        ? new Date(emp.dateOfBirth).toLocaleDateString()
                                        : "-"}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                    {emp.joiningDate
                                        ? new Date(emp.joiningDate).toLocaleDateString()
                                        : "-"}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                    {emp.deletedAt
                                        ? new Date(emp.deletedAt).toLocaleDateString()
                                        : "-"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default PreviousEmployees;
