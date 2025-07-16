import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const LeaveRequestModel = ({ show, onHide, request, onStatusUpdate }) => {
  if (!request) return null;

  const { name, department, leaveType, startDate, endDate, reason, status: initialStatus } = request;

  // Local state for status dropdown
  const [status, setStatus] = useState(initialStatus || "Pending");

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSave = () => {
    // Call the parent callback to update status
    onStatusUpdate(request.id, status);
    onHide();
  };

  // Define styles based on status
  const getStatusStyle = () => {
    switch (status) {
      case "Accepted":
        return { backgroundColor: "#d4edda", color: "#155724", borderColor: "#c3e6cb" };
      case "Rejected":
        return { backgroundColor: "#f8d7da", color: "#721c24", borderColor: "#f5c6cb" };
      case "Pending":
        return { backgroundColor: "#fff3cd", color: "#856404", borderColor: "#ffeeba" };
      default:
        return {};
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Leave Request Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex">
          <div className="me-5 text-center">
            <div
              style={{
                backgroundColor: "#ccc",
                width: 80,
                height: 80,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 28,
                marginBottom: 10,
              }}
            >
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>{name}</div>
          </div>
          <div className="flex-grow-1">
            <div className="mb-2"><strong>Department:</strong> {department}</div>
            <div className="mb-2"><strong>Leave Type:</strong> {leaveType}</div>
            <div className="mb-2"><strong>Start Date:</strong> {startDate}</div>
            <div className="mb-2"><strong>End Date:</strong> {endDate}</div>
            <div className="mb-2"><strong>Reason:</strong> {reason}</div>

            <Form.Group className="mt-3">
              <Form.Label><strong>Status</strong></Form.Label>
              <Form.Select
                value={status}
                onChange={handleStatusChange}
                style={{
                  ...getStatusStyle(),
                  padding: "8px",
                  fontWeight: "bold",
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Status
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LeaveRequestModel;