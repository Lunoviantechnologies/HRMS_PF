import { grey } from "@mui/material/colors";
import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    const handleDashboard = () => navigate('/dashboard');
    const handleAttendence = () => navigate('/dashboard/attendence');
    const handleAddEmployee = () => navigate('/dashboard/addEmployee');
    const handleAllEmployees = () => navigate('/dashboard/allEmployees');
    const handleLeaveRequest = () => navigate('/dashboard/leaveRequest');

    const SidebarContent = () => (
        <div className="text-white d-flex flex-column p-3" style={{ width: '250px', height: 'calc(100vh - 56px)', top: '56px', overflowY: 'auto', zIndex: 1020, backgroundColor: 'rgb(2,2,95)' }}>
            <ul className="list-group list-group-flush">
                <li className="list-group-item text-white border-0" style={{backgroundColor: 'rgb(2,2,95)' }}>
                    <button className="btn border-0 text-white w-100 text-start" onClick={handleDashboard}>
                        <i className="bi bi-speedometer2 me-2"></i> Dashboard
                    </button>
                </li>
                <li className="list-group-item text-white border-0" style={{backgroundColor: 'rgb(2,2,95)' }}>
                    <button className="btn border-0 text-white w-100 text-start" onClick={handleAttendence}>
                        <i className="bi bi-clock"></i> Attendence
                    </button>
                </li>
                <li className="list-group-item text-white border-0" style={{backgroundColor: 'rgb(2,2,95)' }}>
                    <button className="btn border-0 text-white w-100 text-start" onClick={handleAllEmployees}>
                        <i className="bi bi-people me-2"></i> All Employees
                    </button>
                </li>
                <li className="list-group-item text-white border-0" style={{backgroundColor: 'rgb(2,2,95)' }}>
                    <button className="btn border-0 text-white w-100 text-start" onClick={handleAddEmployee}>
                        <i className="bi bi-person-plus me-2"></i> Add Employee
                    </button>
                </li>
                <li className="list-group-item text-white border-0" style={{backgroundColor: 'rgb(2,2,95)' }}>
                    <button className="btn border-0 text-white w-100 text-start" onClick={handleLeaveRequest}>
                        <i className="bi bi-envelope me-2"></i> Leave Request
                    </button>
                </li>
            </ul>
        </div>
    );

    return (
        <>
            {/* Offcanvas for small screens */}
            <div style={{backgroundColor: 'rgb(2,2,95)', width: '250px'}} className="offcanvas offcanvas-start text-white d-md-none" tabIndex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasSidebarLabel">Menu</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-0">
                    <SidebarContent />
                </div>
            </div>

            {/* Sticky Sidebar for medium and up */}
            <div className="d-none d-md-block">
                <SidebarContent />
            </div>
        </>
    );
};

export default Sidebar;
