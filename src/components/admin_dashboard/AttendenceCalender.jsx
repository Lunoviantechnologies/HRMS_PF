import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AttendanceCalendar = ({ records }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    // ✅ Update records when modal opens
    useEffect(() => {
        if (records && Array.isArray(records)) {
            setAttendanceRecords(records);
        }
    }, [records]);

    // ✅ Format date to YYYY-MM-DD
    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date)) return null;
        return date.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
    };

    // ✅ Decide calendar tile style
    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const formattedDate = formatDate(date);
            const record = attendanceRecords.find((r) => r.date === formattedDate);

            if (record?.status?.toLowerCase() === "present") return "present-day";
            if (record?.status?.toLowerCase() === "absent") return "absent-day";
            if (record?.status?.toLowerCase() === "half") return "halfday-day";
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

            {/* ✅ Legend */}
            <div className="legend">
                <span className="legend-item present">Present</span>
                <span className="legend-item absent">Absent</span>
                <span className="legend-item halfday">Half-day</span>
            </div>
        </div>
    );
};

export default AttendanceCalendar;