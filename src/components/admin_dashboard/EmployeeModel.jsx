import React from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

const EmployeeModel = ({ show, onHide, employee }) => {
  if (!employee) return null;

  const getInitials = (fname, lname) => {
    return `${fname?.[0] || ""}${lname?.[0] || ""}`.toUpperCase();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Employee's Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* Left Column with initials */}
          <Col md={4} className="text-center">
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#ddd",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {getInitials(employee.fname, employee.lname)}
            </div>
            <div style={{ marginTop: 10, fontWeight: "bold" }}>
              {employee.fname} {employee.lname}
            </div>
          </Col>

          {/* Right Column with details */}
          <Col md={8}>
            <Row className="mb-2">
              <Col md={5}><strong>First Name:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.fname}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Last Name:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.lname}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Mobile:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.mobile}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Email:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.email}</Col>
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
              <Col md={5}><strong>Language:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.language || ""}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Monthly Salary:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.salary || ""}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Enrollment Date:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.enrollDate || ""}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Account Number:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.account || ""}</Col>
            </Row>
            <Row className="mb-2">
              <Col md={5}><strong>Bank:</strong></Col>
              <Col md={7} style={{ backgroundColor: "#dff6f0" }}>{employee.bank || ""}</Col>
            </Row>

            {/* Upload Section */}
            <Row className="mt-3">
              <Col md={5}><strong>Upload Document:</strong></Col>
              <Col md={7}>
                <Form.Control type="file" />
              </Col>
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