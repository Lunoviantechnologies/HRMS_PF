import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Pagination } from 'react-bootstrap';
import EmployeeModel from "./EmployeeModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";
import EditEmployeeModel from "./EditEmployeeModel";

const EmployeesList = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [allEmployeesList, setAllEmployeesList] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [filterEmployee, setFilterEmployee] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get(`${backendIP}/api/employees/all`, {
            headers: { Authorization: token }
        }).then(res => {
            setAllEmployeesList(res.data);
        }).catch(err => console.log(err));
    }, [token]);

    const handleView = (employee) => {
        setSelectedEmp(employee);
        setShowViewModal(true);
    };

    const handleUpdate = (employee) => {
        setSelectedEmp(employee);
        setShowEditModal(true);
    };

    const handleDelete = (employee) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${employee.firstName}?`);
        if (!confirmDelete) return;

        axios.delete(`${backendIP}/api/employees/delete/${employee.id}`, {
            headers: { Authorization: token }
        }).then(res => {
            alert('Employee deleted successfully');
            const updatedList = allEmployeesList.filter(e => e.id !== employee.id);
            setAllEmployeesList(updatedList);
        }).catch(err => {
            console.log('Employee not deleted', err);
            alert('Failed to delete employee');
        });
    };

    const handleAddEmployee = () => {
        navigate('/dashboard/addEmployee');
    };

    // Filter + Pagination logic
    const filteredEmployees = allEmployeesList.filter(emp => {
        if (!filterEmployee) return true;
        const search = filterEmployee.toLowerCase();
        return (
            emp.firstName?.toLowerCase().includes(search) ||
            emp.lastName?.toLowerCase().includes(search) ||
            emp.workEmail?.toLowerCase().includes(search) ||
            emp.contactNumber1?.toLowerCase().includes(search) ||
            emp.id?.toString().toLowerCase().includes(search)
        );
    });

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }
        return (
            <Pagination className="justify-content-center mt-3">
                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                {items}
                <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
        );
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5><strong>All Employees</strong></h5>

                {/* Search Bar */}
                <div className="input-group me-3 d-none d-sm-flex w-25">
                    <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-search text-dark"></i>
                    </span>
                    <input
                        className="form-control p-2"
                        type="search"
                        placeholder="Check your query..."
                        aria-label="Search"
                        onChange={(e) => {
                            setFilterEmployee(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <Button variant="primary" onClick={handleAddEmployee}>Add New Employee</Button>
            </div>

            {/* Fixed height table container */}
            <div style={{ maxHeight: "600px", overflowY: "auto" }} className="border rounded shadow-sm">
                <Table bordered hover responsive className="text-center align-middle mb-0">
                    <thead className="table-light sticky-top" style={{ top: 0, zIndex: 1 }}>
                        <tr>
                            <th className="tableHeader_employeeList">Employee ID</th>
                            <th className="tableHeader_employeeList">Thumbnail</th>
                            <th className="tableHeader_employeeList">First Name</th>
                            <th className="tableHeader_employeeList">Last Name</th>
                            <th className="tableHeader_employeeList">Mobile</th>
                            <th className="tableHeader_employeeList">E-mail</th>
                            <th className="tableHeader_employeeList">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEmployees.length > 0 ? (
                            currentEmployees.map((employees) => (
                                <tr key={employees.id}>
                                    <td>{employees.id}</td>
                                    <td>
                                        {employees.profilePhoto ? (
                                            <img
                                                className="rounded-circle"
                                                width={"40px"}
                                                height={"40px"}
                                                src={`data:image/jpeg;base64,${employees.profilePhoto}`}
                                                alt="Profile"
                                            />
                                        ) : (
                                            <div
                                                className="rounded-circle bg-light d-inline-block"
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    lineHeight: "40px",
                                                }}
                                            >
                                                {(employees.firstName?.[0] || "-").toUpperCase() +
                                                    (employees.lastName?.[0] || "-").toUpperCase()}
                                            </div>
                                        )}
                                    </td>
                                    <td>{employees.firstName}</td>
                                    <td>{employees.lastName}</td>
                                    <td>{employees.contactNumber1}</td>
                                    <td className="text-danger">
                                        <b>{employees.workEmail}</b>
                                    </td>
                                    <td>
                                        <Button
                                            variant="btn btn-outline-primary mx-1"
                                            title="View Employee"
                                            onClick={() => handleView(employees)}
                                        >
                                            <i className="bi bi-eye"></i>
                                        </Button>
                                        <Button
                                            variant="btn btn-outline-success mx-1"
                                            title="Edit Employee"
                                            onClick={() => handleUpdate(employees)}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Button>
                                        <Button
                                            variant="btn btn-outline-danger mx-1"
                                            title="Delete Employee"
                                            onClick={() => handleDelete(employees)}
                                        >
                                            <i className="bi bi-trash3-fill"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-3 text-muted">
                                    No employees found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {renderPagination()}

            {selectedEmp && (
                <EmployeeModel show={showViewModal} onHide={() => setShowViewModal(false)} employee={selectedEmp} />
            )}

            {selectedEmp && (
                <EditEmployeeModel show={showEditModal} onHide={() => setShowEditModal(false)} employee={selectedEmp} />
            )}
        </div>
    );
};

export default EmployeesList;