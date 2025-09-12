import React, { useEffect, useState } from "react";
import { Button, Table, Modal } from 'react-bootstrap';
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
    const [filterEmployee, setFilterEmployee] = useState();

    const handleView = (employee) => {
        setSelectedEmp(employee);
        // console.log(employee.id); 
        setShowViewModal(true);
    };

    useEffect(() => {
        axios.get(`${backendIP}/HRMS/api/employees/all`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            console.log(res.data);
            setAllEmployeesList(res.data);
        }).catch(err => console.log(err));
    }, [token]);

    const handleUpdate = (employee) => {
        setSelectedEmp(employee);
        // console.log(employee.id);
        setShowEditModal(true);
    };

    const handleDelete = (employee) => {
        // console.log(employee.id);

        const confirmDelete = window.confirm(`Are you sure you want to delete ${employee.firstName}?`);
        if (!confirmDelete) return;

        axios.delete(`${backendIP}/HRMS/api/employees/delete/${employee.id}`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            console.log('Employee deleted successfully', res.data);
            alert('Employee deleted successfully');

            const updatedEmployeesList = allEmployeesList.filter(removeEmployee => removeEmployee.id !== employee.id);
            setAllEmployeesList(updatedEmployeesList);
        }).catch(err => {
            console.log('Employee not deleted', err);
            alert('Failed to delete employee');
        })
    };

    const handleAddEmployee = () => {
        navigate('/dashboard/addEmployee');
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
                        onChange={(e) => setFilterEmployee(e.target.value)}
                    />
                </div>
                <Button variant="primary" onClick={handleAddEmployee}>Add New Employee</Button>
            </div>

            <Table bordered hover responsive className="shadow-sm">
                <thead>
                    <tr>
                        <th className="tableHeader_employeeList">Thumbnail</th>
                        <th className="tableHeader_employeeList">First Name</th>
                        <th className="tableHeader_employeeList">Last Name</th>
                        <th className="tableHeader_employeeList">Mobile</th>
                        <th className="tableHeader_employeeList">E-mail</th>
                        <th className="tableHeader_employeeList">Action</th> 
                    </tr>
                </thead>
                <tbody className="text-center">
                    {
                        allEmployeesList ? (
                            allEmployeesList
                                .filter((emp) => {
                                    if (!filterEmployee) return true; // no filter, show all
                                    const search = filterEmployee.toLowerCase();
                                    return (
                                        emp.firstName?.toLowerCase().includes(search) ||
                                        emp.lastName?.toLowerCase().includes(search) ||
                                        emp.workEmail?.toLowerCase().includes(search) ||
                                        emp.contactNumber1?.toLowerCase().includes(search)
                                    );
                                })
                                .map((employees) => {
                                    return (
                                        <tr key={employees.id}>
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
                                    );
                                })
                        ) : (
                            <tr>
                                <td colSpan="6">
                                    <div className="text-center py-3">
                                        <div className="spinner-border text-primary" role="status" />
                                        <div>Loading employees...</div>
                                    </div>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>

            {
                selectedEmp && (
                    <EmployeeModel show={showViewModal} onHide={() => setShowViewModal(false)} employee={selectedEmp} />
                )
            }

            {
                selectedEmp && (
                    <EditEmployeeModel show={showEditModal} onHide={() => { setShowEditModal(false) }} employee={selectedEmp} />
                )
            }

        </div>
    )
};

export default EmployeesList;