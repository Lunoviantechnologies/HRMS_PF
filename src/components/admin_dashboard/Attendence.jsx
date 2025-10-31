import React, { useEffect, useState } from "react";
import { Button, Modal, Card, Table, OverlayTrigger, Tooltip, Pagination,} from "react-bootstrap";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import backendIP from "../../api";
import AttendanceCalendar from "./AttendenceCalender";

const Attendance = () => {
  const { token } = useAuth();
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [allEmployeesList, setAllEmployeesList] = useState([]);
  const [currentView, setCurrentView] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const allColumns = [
    { key: "id", header: "ID", width: "70px", field: "id" },
    { key: "photo", header: "Thumbnail", width: "100px", field: "photo" },
    { key: "employeeEmail", header: "Email", width: "200px", field: "employeeEmail" },
    { key: "breakeStatus", header: "Status", width: "150px", field: "breakeStatus" },
    { key: "date", header: "Date", width: "150px", field: "date" },
    { key: "punchIn", header: "Punch In", width: "150px", field: "punchIn" },
    { key: "punchOut", header: "Punch Out", width: "150px", field: "punchOut" },
    { key: "location", header: "Location", width: "180px", field: "location" },
    { key: "actions", header: "Action", width: "120px", field: "actions" },
  ];

  const absentColumns = [
    { key: "id", header: "ID", width: "70px", field: "id" },
    { key: "emailId", header: "Email", width: "200px", field: "emailId" },
    { key: "status", header: "Status", width: "150px", field: "status" },
    { key: "date", header: "Date", width: "150px", field: "date" },
    { key: "actions", header: "Action", width: "120px", field: "actions" },
  ];

  const getColumns = () => (currentView === "absent" ? absentColumns : allColumns);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await axios.get(`${backendIP}/api/employees/all`, {
          headers: { Authorization: token },
        });
        const allEmployees = empRes.data;
        setAllEmployeesList(allEmployees);

        const attRes = await axios.get(`${backendIP}/api/attendance/all`, {
          headers: { Authorization: token },
        });

        const formattedData = attRes.data.map((item, index) => ({
          ...item,
          id: item.id || index + 1,
          date: new Date(item.date).toLocaleDateString("en-CA"),
          originalPunchIn: item.punchIn,
          originalPunchOut: item.punchOut,
          punchIn: item.punchIn
            ? new Date(item.punchIn).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "-",
          punchOut: item.punchOut
            ? new Date(item.punchOut).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "-",
        }));

        setEmployeeAttendance(formattedData);
        setFilteredData(formattedData);
        setCurrentView("all");
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [token]);

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPagination = () => (
    <Pagination className="justify-content-center mt-3 flex-wrap">
      <Pagination.First
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
      />
      <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
      {[...Array(totalPages)].map((_, index) => (
        <Pagination.Item
          key={index + 1}
          active={index + 1 === currentPage}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
      <Pagination.Last
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
      />
    </Pagination>
  );

  // ✅ Filters
  const handleAttendanceAll = () => {
    setCurrentView("all");
    setFilteredData(employeeAttendance);
    setCurrentPage(1);
  };

  const handleAttendancePresent = () => {
    const today = new Date();
    const present = employeeAttendance.filter((record) => {
      const recordDate = new Date(record.originalPunchIn);
      return (
        record.originalPunchIn && recordDate.toDateString() === today.toDateString()
      );
    });
    setCurrentView("present");
    setFilteredData(present);
    setCurrentPage(1);
  };

  const handleAttendanceAbsent = () => {
    const currentDate = new Date();
    const todayDateString = currentDate.toLocaleDateString("en-CA");
    const todayPresentEmails = employeeAttendance
      .filter(
        (record) =>
          new Date(record.originalPunchIn).toDateString() ===
          currentDate.toDateString()
      )
      .map((rec) => rec.employeeEmail);

    const absent = allEmployeesList
      .filter((emp) => !todayPresentEmails.includes(emp.emailId))
      .map((emp, index) => ({
        id: emp.id || index + 1,
        emailId: emp.emailId,
        status: "Absent",
        date: todayDateString,
      }));

    setCurrentView("absent");
    setFilteredData(absent);
    setCurrentPage(1);
  };

  // ✅ Cell Renderer
  const renderCell = (row, columnKey) => {
    const value = row[columnKey];
    switch (columnKey) {
      case "photo":
        return value ? (
          <img
            src={`data:image/jpeg;base64,${value}`}
            alt="Employee"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <span>No Photo</span>
        );
      case "breakeStatus":
        return (
          <b style={{ color: value === "ACTIVE" ? "green" : "red" }}>{value}</b>
        );
      case "location":
        return (
          <OverlayTrigger placement="top" overlay={<Tooltip>{value}</Tooltip>}>
            <span
              style={{
                display: "inline-block",
                maxWidth: "150px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
              }}
            >
              {value}
            </span>
          </OverlayTrigger>
        );
      case "actions":
        return (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleView(row)}
          >
            View
          </Button>
        );
      default:
        return value;
    }
  };

  // ✅ FIX: Populate calendar records using existing data
  const handleView = (row) => {
    setSelectedRow(row);
    setShowModal(true);

    const records = employeeAttendance
      .filter((att) => att.employeeEmail === row.employeeEmail)
      .map((att) => ({
        date: att.date, // "YYYY-MM-DD"
        status: att.punchIn && att.punchOut ? "present" : "absent",
      }));

    setAttendanceRecords(records);
  };

  return (
    <div className="container mt-2">
      <h1 className="mb-3">Employee Attendance</h1>

      <div className="mb-3 d-flex gap-2">
        <Button
          variant={currentView === "all" ? "primary" : "outline-primary"}
          onClick={handleAttendanceAll}
        >
          All
        </Button>
        <Button
          variant={currentView === "present" ? "success" : "outline-success"}
          onClick={handleAttendancePresent}
        >
          Present
        </Button>
        <Button
          variant={currentView === "absent" ? "danger" : "outline-danger"}
          onClick={handleAttendanceAbsent}
        >
          Absent
        </Button>
      </div>

      <Card className="shadow mt-3 p-3">
        <Card.Title className="text-center">
          Employee Attendance List
        </Card.Title>

        {/* ✅ Fixed Height Scrollable Table */}
        <div
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            overflowX: "auto",
            marginTop: "20px",
            whiteSpace: "nowrap",
          }}
        >
          <Table
            bordered
            hover
            striped
            className="mb-0 text-center align-middle"
            style={{ minWidth: "1200px" }}
          >
            <thead className="table-primary sticky-top">
              <tr>
                {getColumns().map((column) => (
                  <th
                    key={column.key}
                    style={{
                      width: column.width,
                      backgroundColor: "#0385acff",
                      color: "white",
                      textAlign: "center",
                      verticalAlign: "middle",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                    }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((row) => (
                  <tr key={row.id}>
                    {getColumns().map((col) => (
                      <td key={col.key}>{renderCell(row, col.field)}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={getColumns().length} className="text-center">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* ✅ Always Show Pagination */}
        {renderPagination()}
      </Card>

      {/* ✅ Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Attendance Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRow && (
            <>
              <ul className="list-unstyled">
                <li>
                  <strong>Email:</strong>{" "}
                  {selectedRow.employeeEmail || selectedRow.emailId}
                </li>
              </ul>
              <AttendanceCalendar records={attendanceRecords} />
            </>
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