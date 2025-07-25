import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import { Button, Modal } from "react-bootstrap";

const Attendence = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // 📊 Mock attendance data
    const attendanceRecords = {
        1: {
            "2025-07": [1, 2, 3, 5, 10, 12, 15],
            "2025-06": [1, 3, 5, 7, 11],
        },
    };

    // 🖼 Mock captured attendance photos
    const attendancePhotos = {
        1: {
            "2025-07-10": "https://via.placeholder.com/150", // Replace with real captured photo URL
        },
    };

    const handleView = (row) => {
        setSelectedRow(row);
        setSelectedMonth(new Date().getMonth());
        setSelectedYear(new Date().getFullYear());
        setShowModal(true);
    };

    const generateCalendar = (year, month) => {
        const startDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < startDay; i++) days.push(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(d);

        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        return { weeks, year, month, daysInMonth };
    };

    const calendar = generateCalendar(selectedYear, selectedMonth);

    const getAttendanceData = () => {
        const key = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
        const presentDays = attendanceRecords[selectedRow?.id]?.[key] || [];
        const totalDays = calendar.daysInMonth;
        const absentDays = totalDays - presentDays.length;
        return { presentDays, totalDays, absentDays };
    };

    const getPhotoForDay = (day) => {
        const key = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")} -${String(day).padStart(2, "0")}`;
        return attendancePhotos[selectedRow?.id]?.[key] || null;
    };

    const { presentDays, totalDays, absentDays } = getAttendanceData();

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "firstName", headerName: "First name", width: 130 },
        { field: "lastName", headerName: "Last name", width: 130 },
        { field: "age", headerName: "Age", type: "number", width: 90 },
        {
            field: "actions",
            headerName: "Action",
            width: 120,
            renderCell: (params) => (
                <Button variant="outline-primary" onClick={() => handleView(params.row)}>
                    View
                </Button>
            ),
        },
    ];
    
    const rows = [
        { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
        { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    ];
    // console.log(rows);

    return (
        <div>
            <h1>Employee Attendance</h1>

            <Card sx={{ padding: "10px", boxShadow: 4, marginTop: 3 }}>
                <h4 style={{ textAlign: "center" }}>Employee Attendance</h4>
                <Paper sx={{ height: 400, width: "100%", marginTop: "20px" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                    />
                </Paper>
            </Card>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Attendance Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRow && (
                        <div className="d-flex flex-column gap-4">
                            <div className="d-flex gap-4 align-items-center">
                                <div>
                                    <h5>
                                        <strong>Name:</strong> {selectedRow.firstName} {selectedRow.lastName}
                                    </h5>
                                    <p><strong>Employee ID:</strong> {selectedRow.id}</p>
                                    <p><strong>Age:</strong> {selectedRow.age}</p>
                                </div>
                            </div>

                            {/* Month and Year Selectors */}
                            <div className="d-flex gap-3 align-items-center">
                                <div>
                                    <label>Month:</label>
                                    <select
                                        className="form-select"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i} value={i}>
                                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Year:</label>
                                    <select
                                        className="form-select"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    >
                                        {Array.from({ length: 5 }, (_, i) => {
                                            const y = new Date().getFullYear() - i;
                                            return <option key={y} value={y}>{y}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>

                            {/* Summary */}
                            <div>
                                <p><strong>Total Days:</strong> {totalDays}</p>
                                <p><strong>Present:</strong> {presentDays.length}</p>
                                <p><strong>Absent:</strong> {absentDays}</p>
                            </div>

                            {/* Calendar */}
                            <div className="mt-2">
                                <h5 className="mb-2">
                                    {new Date(selectedYear, selectedMonth).toLocaleString("default", {
                                        month: "long", year: "numeric"
                                    })}
                                </h5>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(7, 1fr)",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    gap: "4px"
                                }}>
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                        <div key={day}>{day}</div>
                                    ))}
                                </div>
                                {calendar.weeks.map((week, i) => (
                                    <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
                                        {week.map((day, j) => {
                                            const dateObj = new Date(selectedYear, selectedMonth, day || 1);
                                            const dayOfWeek = dateObj.getDay();

                                            const isHoliday = day !== null && (dayOfWeek === 0 || dayOfWeek === 6);
                                            const isPresent = day !== null && presentDays.includes(day);
                                            const isAbsent = day !== null && !isPresent && !isHoliday;

                                            let bgColor = "#f1f1f1", color = "#000";
                                            if (isHoliday) {
                                                bgColor = "#ffc107"; // yellow
                                            } else if (isPresent) {
                                                bgColor = "#28a745"; // green
                                                color = "#fff";
                                            } else if (isAbsent) {
                                                bgColor = "#dc3545"; // red
                                                color = "#fff";
                                            }

                                            return (
                                                <div key={j} style={{
                                                    padding: "10px",
                                                    borderRadius: "6px",
                                                    backgroundColor: bgColor,
                                                    color,
                                                    minHeight: "40px",
                                                    fontWeight: "500"
                                                }}>
                                                    {day || ""}
                                                    {day && getPhotoForDay(day) && (
                                                        <div>
                                                            <img src={getPhotoForDay(day)} alt="proof" width="40" height="40" style={{ marginTop: '4px', borderRadius: '4px' }} />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Attendence;