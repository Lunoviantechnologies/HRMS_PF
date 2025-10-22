import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal } from "react-bootstrap";
import { Card, Paper } from "@mui/material";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import backendIP from "../../api";
import AttendanceCalendar from "./AttendenceCalender";

const Attendance = () => {
    const { token } = useAuth();
    const [employeeAttendance, setEmployeeAttendance] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
        axios
            .get(`${backendIP}/api/attendance/all`, {
                headers: { Authorization: token },
            })
            .then((res) => {
                const formattedData = res.data.map((item, index) => ({
                    ...item,
                    id: item.id || index,
                    breakStart: item.breakStart,
                    breakEnd: item.breakEnd,
                    breakeStatus: item.breakeStatus,
                    employeeEmail: item.employeeEmail,
                    location: item.location,
                    photo: item.photo || "-",
                    employee_Id: item.employee_Id,
                    firstName: item.firstName || "",
                    lastName: item.lastName || "",
                    punchIn: new Date(item.punchIn).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }),
                    punchOut: item.punchOut
                        ? new Date(item.punchOut).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                        })
                        : "-",
                    date: new Date(item.date).toLocaleDateString("en-CA") // ✅ fixed
                }));

                setEmployeeAttendance(formattedData);
                // console.log(res.data);

            })
            .catch((err) => {
                console.error("Error fetching attendance:", err);
            });
    }, [token]);

    // Handle view + fetch employee records
    const handleView = (row) => {
        const calculateBreakTime = (row) => {
            const diffMs = new Date(row.breakEnd) - new Date(row.breakStart);
            const totalSeconds = Math.floor(diffMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            // Pad with leading zero → 2 digits
            const pad = (n) => String(n).padStart(2, "0");
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        };

        const calculateWorkingHours = (row) => {
            const start = new Date(row.punchIn);
            const end = new Date(row.punchOut);
            if (!row.punchIn || !row.punchOut || isNaN(start) || isNaN(end)) return "00:00:00";
            let totalMs = end - start; // total working time in ms

            // Subtract break time if provided
            if (row.breakStart && row.breakEnd) {
                const breakStartDate = new Date(row.breakStart);
                const breakEndDate = new Date(row.breakEnd);
                if (!isNaN(breakStartDate) && !isNaN(breakEndDate)) {
                    totalMs -= breakEndDate - breakStartDate;
                }
            }

            if (totalMs < 0) totalMs = 0; // safeguard

            const totalSeconds = Math.floor(totalMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const pad = (n) => String(n).padStart(2, "0");
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        };

        setSelectedRow({ ...row, totalBreakTIme: calculateBreakTime(row), workingHours: calculateWorkingHours(row) });
        setShowModal(true);

        const employeeRecord = employeeAttendance
            .filter(rec => rec.employeeEmail === row.employeeEmail)
            .map((rec) => ({
                date: rec.date,   // already "YYYY-MM-DD"
                status: rec.status || (rec.punchIn ? "present" : "absent")
            }));
        // console.log(employeeRecord);
        setAttendanceRecords(employeeRecord);
    };

    // DataGrid Columns
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "photo",
            headerName: "Thumbnail",
            width: 100,
            renderCell: (params) =>
                params.value && params.value !== "-" ? (
                    <img
                        src={`data:image/jpeg;base64,${params.value}`}
                        alt="Employee"
                        style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", }}
                    />
                ) : (
                    <span>No Photo</span>
                ),
        },
        { field: "employeeEmail", headerName: "Email", width: 200 },
        {
            field: "breakeStatus",
            headerName: "Status",
            width: 150,
            renderCell: (params) => (
                <b style={{ color: params.value === "ACTIVE" ? "green" : "red" }}>
                    {params.value}
                </b>
            ),
        },
        { field: "date", headerName: "Date", width: 150 },
        { field: "punchIn", headerName: "Punch In", width: 150 },
        { field: "punchOut", headerName: "Punch Out", width: 150 },
        { field: "location", headerName: "Location", width: 150 },
        {
            field: "actions",
            headerName: "Action",
            width: 120,
            renderCell: (params) => (
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleView(params.row)}
                >
                    View
                </Button>
            ),
        }
    ];

    return (
        <div className="container mt-4">
            <h1 className="mb-3">Employee Attendance</h1>

            <Card sx={{ padding: "15px", boxShadow: 4, marginTop: 3 }}>
                <h4 style={{ textAlign: "center" }}>Employee Attendance List</h4>

                <Paper sx={{ height: 400, width: "100%", marginTop: "20px" }}>
                    <DataGrid
                        rows={employeeAttendance}
                        columns={columns}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        getRowId={(row) => row.id}
                        sx={{
                            border: "1px solid #ccc",

                            // ✅ header row 
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#0385ac",
                                color: "#fff",
                            },

                            // ✅ header cell text
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: "bold",
                                color: "#fff",
                            },

                            // ✅ checkbox/header icons
                            "& .MuiDataGrid-columnHeader": {
                                backgroundColor: "#0385ac",
                                color: "#fff",
                            },

                            // ✅ rows & columns border
                            "& .MuiDataGrid-cell": {
                                borderRight: "1px solid #ccc",
                            },
                            "& .MuiDataGrid-row": {
                                borderBottom: "1px solid #ccc",
                            },
                        }}
                    />
                </Paper>
            </Card>

            {/* Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Attendance Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRow && (
                        <div>
                            <p>

                            </p>
                            <ul type="none">
                                <li>
                                    <strong>Email :</strong> {selectedRow.employeeEmail}
                                </li>
                                <li>
                                    <strong>Break Time :</strong> {selectedRow.totalBreakTIme}
                                </li>
                                <li>
                                    <strong>Working Hours :</strong> {selectedRow.workingHours}
                                </li>
                            </ul>

                            {/* Real Calendar */}
                            <AttendanceCalendar records={attendanceRecords} />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Attendance;