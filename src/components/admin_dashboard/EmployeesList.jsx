import React, { useEffect, useState } from "react";
import { Button, Table, Modal } from 'react-bootstrap';
import EmployeeModel from "./EmployeeModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

const EmployeesList = () => {

    const { token } = useAuth();
    const navigate = useNavigate();
    const [allEmployeesList, setAllEmployeesList] = useState(null);
    // console.log(allEmployeesList);

    const [selectedEmp, setSelectedEmp] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleView = (employee) => {
        setSelectedEmp(employee);
        console.log(employee.id);
        setShowModal(true);
    };

    const handleAddEmployee = () => {
        navigate('/dashboard/addEmployee');
    };

    useEffect(() => {
        axios.get(`${backendIP}/HRMS/employee/all`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            // console.log(res.data);
            setAllEmployeesList(res.data);
        }).catch(err => console.log(err));
    }, [token]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5><strong>All Employees</strong></h5>
                <Button variant="primary" onClick={handleAddEmployee}>Add New Employee</Button>
            </div>

            <Table bordered hover responsive>
                <thead className="table-success text-center">
                    <tr>
                        <th>Thumbnail</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Mobile</th>
                        <th>E-mail</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {
                        allEmployeesList ? (
                            allEmployeesList.map((employees) => {
                                return (
                                    <tr key={employees.id}>
                                        <td>
                                            {
                                                employees.profilePhoto ? <img className="rounded-circle" width={'40px'} height={'40px'} src={`data:image/jpeg;base64,${employees.profilePhoto}`} alt="Profile photo" />
                                                    : (
                                                        <div className="rounded-circle bg-light d-inline-block" style={{ width: '40px', height: '40px', lineHeight: '40px' }}>
                                                            {(employees.firstName?.[0] || '-').toUpperCase() + (employees.lastName?.[0] || '-').toUpperCase()}
                                                        </div>
                                                    )
                                            }
                                        </td>
                                        <td>{employees.firstName}</td>
                                        <td>{employees.lastName}</td>
                                        <td>{employees.contactNumber1}</td>
                                        <td className="text-danger"><b>{employees.emailId}</b></td>
                                        <td>
                                            <Button variant="btn btn-outline-primary me-1" title="View Employee" onClick={() => handleView(employees)}><i className="bi bi-eye"></i></Button>
                                            <Button variant="btn btn-outline-success me-1" title="Edit Employee" onClick={() => handleUpdate(employees)}><i className="bi bi-pencil"></i></Button>
                                            <Button variant="btn btn-outline-danger" title="Delete Employee" onClick={() => handleDelete(employees)}><i className="bi bi-trash3-fill"></i></Button>
                                        </td>
                                    </tr>
                                )
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

            {selectedEmp && (
                <EmployeeModel
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    employee={selectedEmp}
                />
            )}

        </div>
    )
};

export default EmployeesList;