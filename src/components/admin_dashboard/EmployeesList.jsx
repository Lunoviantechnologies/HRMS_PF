import React, { useEffect, useState } from "react";
import { Button, Table, Modal } from 'react-bootstrap';
import EmployeeModel from "./EmployeeModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backendIP from "../../api";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";

const EmployeesList = () => {

   const { token } = useAuth();
    const navigate = useNavigate();
    const employees = [
        { id: 1, fname: "Sohan", lname: "Yadav", mobile: "9212238332", email: "sohan@example.com" },
        { id: 2, fname: "Mohan", lname: "Singh", mobile: "6245231321", email: "mohan@example.com" },
        { id: 3, fname: "Rohan", lname: "Kumar", mobile: "9212238332", email: "rohan@example.com" },
        { id: 4, fname: "Sohan", lname: "Mehra", mobile: "6245231321", email: "sohan.mehra@example.com" },
        { id: 5, fname: "Sohan", lname: "Yadav", mobile: "9212238332", email: "sohan@example.com" },
        { id: 6, fname: "Sohan", lname: "Yadav", mobile: "9212238332", email: "sohan@example.com" }
    ];

    function getInitials(fname, lname) {
        return (fname[0] + lname[0]).toUpperCase();
    };

    const [selectedEmp, setSelectedEmp] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleView = (employee) => {
        setSelectedEmp(employee);
        setShowModal(true);
    };

    const handleAddEmployee = ()=>{
        navigate('/dashboard/addEmployee');
    };

    useEffect(()=>{
        axios.get(`${backendIP}/HRMS/employee/all`,{
            headers: {
                Authorization: token
            }
        }).then(res =>{
            console.log(res.data);
        }).catch(err => console.log(err));
    }, []);

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
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>
                                <div className="rounded-circle bg-light d-inline-block" style={{ width: '40px', height: '40px', lineHeight: '40px' }}>
                                    {getInitials(emp.fname, emp.lname)}
                                </div>
                            </td>
                            <td>{emp.fname}</td>
                            <td>{emp.lname}</td>
                            <td>{emp.mobile}</td>
                            <td className="text-danger"><b>{emp.email}</b></td>
                            <td><Button variant="secondary" onClick={() => handleView(emp)}>View</Button></td>
                        </tr>
                    ))}
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