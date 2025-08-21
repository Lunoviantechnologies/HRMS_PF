import React from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

const EmployeeModel = ({ show, onHide, employee }) => {
  if (!employee) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Employee's Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* Left Column with initials */}
          <Col md={4} className="text-center">
            <div>
              {
                employee.profilePhoto ? <img className="rounded-circle" width={'80px'} height={'80px'} src={`data:image/jpeg;base64,${employee.profilePhoto}`} alt="Profile photo" />
                  : (
                    <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#ddd", margin: "0 auto", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 24, fontWeight: "bold"}}>
                        {(employee.firstName?.[0] || '-').toUpperCase() + (employee.lastName?.[0] || '-').toUpperCase()}
                    </div>
                  )
              }
            </div>
            <div style={{ marginTop: 10, fontWeight: "bold" }}>
              {employee.firstName} {employee.lastName}
            </div>
          </Col>

          {/* Right Column with details */}
          <Col md={8}>
            <Row className="mb-2">
              <Col md={5}><strong>First Name:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.firstName}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Last Name:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.lastName}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Mobile:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.contactNumber1}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Email:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.workEmail}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Gender:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.gender || ""}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Department:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.department || ""}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Experience:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.previousExperience || ""}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Salary:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.basicEmployeeSalary || ""}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Joining Date:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.joiningDate || ""}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Account Number:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.accountNo || ""}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Bank:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.bankName || ""}</Col>
            </Row>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmployeeModel;