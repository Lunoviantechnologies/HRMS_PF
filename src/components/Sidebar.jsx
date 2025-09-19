import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSection, setOpenSection] = useState(null);

  const isActive = (path) => location.pathname === path;

  const toggleSection = (sectionId) => {
    setOpenSection((prev) => (prev === sectionId ? null : sectionId));
  };

  const navItem = (label, path) => (
    <li
      className="list-group-item text-white border-0"
      style={{ backgroundColor: "rgb(2,2,95)" }}
    >
      <button
        className={`btn border-0 text-white w-100 text-start sidebar-link ${isActive(path) ? "active" : ""
          }`}
        onClick={() => navigate(path)}
        data-bs-dismiss="offcanvas" // <-- auto close offcanvas on click
      >
        {label}
      </button>
    </li>
  );

  const collapsibleSection = (id, icon, title, children) => (
    <>
      <li
        className="list-group-item text-white border-0"
        style={{ backgroundColor: "rgb(2,2,95)" }}
      >
        <button
          className="btn border-0 text-white w-100 text-start"
          onClick={() => toggleSection(id)}
        >
          <i className={`me-2 ${icon}`}></i> {title}
        </button>
      </li>
      <div className={`ps-3 ${openSection === id ? "d-block" : "d-none"}`}>
        {children}
      </div>
    </>
  );

  const SidebarContent = () => (
    <div
      className="text-white d-flex flex-column p-3"
      style={{
        width: "250px",
        maxHeight: "calc(100vh - 56px)",
        overflowY: "auto",
        backgroundColor: "rgb(2,2,95)",
      }}
    >
      <ul className="list-group list-group-flush" style={{ paddingBottom: "100px" }}>
        {collapsibleSection(
          "dashboardMgmt",
          "bi-people",
          "Dashboard",
          <>
            {navItem("View", "/dashboard")}
          </>
        )}

        {collapsibleSection(
          "employeeMgmt",
          "bi-people",
          "Employees",
          <>
            {navItem("Add Employee", "/dashboard/addEmployee")}
            {navItem("Employees List", "/dashboard/allEmployees")}
            {navItem("Previous Employees", "/dashboard/previousEmployees")}
          </>
        )}

        {collapsibleSection(
          "attendanceMgmt",
          "bi-calendar-check",
          "Attendance",
          <>
            {navItem("Attendance Dashboard", "/dashboard/attendence")}
            {/* {navItem("Mark Attendance", "/dashboard/markAttendance")} */}
            {/* {navItem("Upload Attendance", "/dashboard/uploadAttendance")} */}
            {/* {navItem("Calendar View", "/dashboard/attendanceCalendar")} */}
          </>
        )}

        {collapsibleSection(
          "leaveMgmt",
          "bi-envelope-open",
          "Leave",
          <>
            {navItem("Leave Requests", "/dashboard/leaveRequest")}
            {navItem("Leave Policy", "/dashboard/leavePolicy")}
          </>
        )}

        {collapsibleSection(
          "payrollMgmt",
          "bi-cash-stack",
          "Payroll",
          <>
            {navItem("Salary Dashboard", "/dashboard/salaryDashboard")}
            {navItem("Employee Salaries", "/dashboard/employeeSalary")}
            {/* {navItem("Generate Payslip", "/dashboard/generatePayslip")} */}
            {/* {navItem("Send Payslip", "/dashboard/sendPayslip")} */}
            {/* {navItem("PF & Deductions", "/dashboard/pfDeductions")} */}
          </>
        )}
{/* 
        {collapsibleSection(
          "reportsAnalytics",
          "bi-bar-chart",
          "Reports & Analytics",
          <>
            {navItem("Attendance Report", "/dashboard/attendanceReport")}
            {navItem("Salary Report", "/dashboard/salaryReport")}
            {navItem("Leave Report", "/dashboard/leaveReport")}
            {navItem("Download CSV", "/dashboard/downloadCSV")}
          </>
        )} */}

        {/* {collapsibleSection(
          "systemSettings",
          "bi-gear-wide-connected",
          "System Settings",
          <>
            {navItem("Company Settings", "/dashboard/companySettings")}
            {navItem("Shift Timing", "/dashboard/shiftTimings")}
            {navItem("Holiday Config", "/dashboard/holidays")}
            {navItem("Roles & Permissions", "/dashboard/rolesPermissions")}
          </>
        )} */}
      </ul>
    </div>
  );

  return (
    <>
      {/* Mobile Offcanvas Sidebar */}
      <div
        className="offcanvas offcanvas-start text-white d-md-none"
        tabIndex="-1"
        id="offcanvasSidebar"
        aria-labelledby="offcanvasSidebarLabel"
        style={{ backgroundColor: "rgb(2,2,95)", width: "250px" }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasSidebarLabel">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="d-none d-md-block">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
