import React, { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal } from "react-bootstrap";
import { Card, Paper } from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import backendIP from "../../api";

// ================== Calendar Component ==================
const AttendanceCalendar = ({ records }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Convert date to YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split("T")[0];

    // Decide tile class based on attendance
    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const status = records.find(
                (r) => formatDate(new Date(r.date)) === formatDate(date)
            )?.status;

            if (status === "present") return "present-day";
            if (status === "absent") return "absent-day";
            if (status === "half") return "halfday-day";
        }
        return null;
    };

    return (
        <div style={{ textAlign: "center" }}>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
            />

            <p style={{ marginTop: "10px" }}>
                Selected Date: <b>{selectedDate.toDateString()}</b>
            </p>

            {/* Legend */}
            <div className="legend">
                <span className="legend-item present">Present</span>
                <span className="legend-item absent">Absent</span>
                <span className="legend-item halfday">Half-day</span>
            </div>
        </div>
    );
};

// ================== Main Component ==================
const Attendance = () => {
    const { token } = useAuth();
    const [employeeAttendance, setEmployeeAttendance] = useState([]);
import { Card, Paper } from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import backendIP from "../../api";

// ================== Calendar Component ==================
const AttendanceCalendar = ({ records }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Convert date to YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split("T")[0];

    // Decide tile class based on attendance
    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const status = records.find(
                (r) => formatDate(new Date(r.date)) === formatDate(date)
            )?.status;

            if (status === "present") return "present-day";
            if (status === "absent") return "absent-day";
            if (status === "half") return "halfday-day";
        }
        return null;
    };

    return (
        <div style={{ textAlign: "center" }}>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
            />

            <p style={{ marginTop: "10px" }}>
                Selected Date: <b>{selectedDate.toDateString()}</b>
            </p>

            {/* Legend */}
            <div className="legend">
                <span className="legend-item present">Present</span>
                <span className="legend-item absent">Absent</span>
                <span className="legend-item halfday">Half-day</span>
            </div>
        </div>
    );
};

// ================== Main Component ==================
const Attendance = () => {
    const { token } = useAuth();
    const [employeeAttendance, setEmployeeAttendance] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    // Fetch all employees
    useEffect(() => {
        axios
            .get(`${backendIP}/api/attendance/all`, {
                headers: { Authorization: token },
            })
            .then((res) => {
                const formattedData = res.data.map((item, index) => ({
                    id: item.id || index,
                    employeeEmail: item.employeeEmail,
                    location: item.location,
                    photo: item.photo || "-",
                    employeeId: item.employeeId,
                    firstName: item.firstName || "",
                    lastName: item.lastName || "",
                    ...item,
                }));
                setEmployeeAttendance(formattedData);
            })
            .catch((err) => {
                console.error("Error fetching attendance:", err);
            });
    }, [token]);

    // Handle view + fetch employee records
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    // Fetch all employees
    useEffect(() => {
        axios
            .get(`${backendIP}/api/attendance/all`, {
                headers: { Authorization: token },
            })
            .then((res) => {
                const formattedData = res.data.map((item, index) => ({
                    id: item.id || index,
                    employeeEmail: item.employeeEmail,
                    location: item.location,
                    photo: item.photo || "-",
                    employeeId: item.employeeId,
                    firstName: item.firstName || "",
                    lastName: item.lastName || "",
                    ...item,
                }));
                setEmployeeAttendance(formattedData);
            })
            .catch((err) => {
                console.error("Error fetching attendance:", err);
            });
    }, [token]);

    // Handle view + fetch employee records
    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);

        axios
            .get(`${backendIP}/HRMS/api/attendance/${row.employeeId}`, {
                headers: { Authorization: token },
                params: { year: new Date().getFullYear() }, // full year records
            })
            .then((res) => {
                setAttendanceRecords(res.data);
            })
            .catch((err) => {
                console.error("Error fetching employee attendance:", err);
            });

        axios
            .get(`${backendIP}/HRMS/api/attendance/${row.employeeId}`, {
                headers: { Authorization: token },
                params: { year: new Date().getFullYear() }, // full year records
            })
            .then((res) => {
                setAttendanceRecords(res.data);
            })
            .catch((err) => {
                console.error("Error fetching employee attendance:", err);
            });
    };

    // DataGrid Columns
    // DataGrid Columns
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "employeeEmail", headerName: "Email", width: 200 },
        { field: "location", headerName: "Location", width: 150 },
        {
            field: "photo",
            headerName: "Thumbnail",
            width: 100,
            renderCell: (params) =>
                params.value && params.value !== "-" ? (
                    <img
                        src={`data:image/jpeg;base64,${params.value}`}
                        alt="Employee"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover"
                        }}
                    />
                ) : (
                    <span>No Photo</span>
                ),
        },
        { field: "employeeEmail", headerName: "Email", width: 200 },
        { field: "location", headerName: "Location", width: 150 },
        {
            field: "photo",
            headerName: "Thumbnail",
            width: 100,
            renderCell: (params) =>
                params.value && params.value !== "-" ? (
                    <img
                        src={`data:image/jpeg;base64,${params.value}`}
                        alt="Employee"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover"
                        }}
                    />
                ) : (
                    <span>No Photo</span>
                ),
        },
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
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleView(params.row)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <div className="container mt-4">
            <h1 className="mb-3">Employee Attendance</h1>
        <div className="container mt-4">
            <h1 className="mb-3">Employee Attendance</h1>

            <Card sx={{ padding: "15px", boxShadow: 4, marginTop: 3 }}>
                <h4 style={{ textAlign: "center" }}>Employee Attendance List</h4>
            <Card sx={{ padding: "15px", boxShadow: 4, marginTop: 3 }}>
                <h4 style={{ textAlign: "center" }}>Employee Attendance List</h4>
                <Paper sx={{ height: 400, width: "100%", marginTop: "20px" }}>
                    <DataGrid
                        rows={employeeAttendance}
                        rows={employeeAttendance}
                        columns={columns}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        getRowId={(row) => row.id}
                        getRowId={(row) => row.id}
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
                            <h5>
                                <strong>Name:</strong> {selectedRow.firstName}{" "}
                                {selectedRow.lastName}
                            </h5>
                            <p>
                                <strong>Email:</strong> {selectedRow.employeeEmail}
                            </p>
                        <div>
                            <h5>
                                <strong>Name:</strong> {selectedRow.firstName}{" "}
                                {selectedRow.lastName}
                            </h5>
                            <p>
                                <strong>Email:</strong> {selectedRow.employeeEmail}
                            </p>

                            {/* Real Calendar */}
                            <AttendanceCalendar records={attendanceRecords} />
                            {/* Real Calendar */}
                            <AttendanceCalendar records={attendanceRecords} />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Attendence;