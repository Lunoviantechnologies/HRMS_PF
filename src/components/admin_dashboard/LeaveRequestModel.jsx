import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const LeaveRequestModel = ({ show, onHide, request, onStatusUpdate }) => {
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    if (request) {
      setStatus(request.status || "Pending");
    }
  }, [request]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSave = () => {
    if (request) {
      onStatusUpdate(request.id, status);
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Leave Request Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          request ? (
            <div className="d-flex">
              <div className="me-5 text-center">
                <div style={{ backgroundColor: "#ccc", width: 80, height: 80, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center",
                    fontSize: 28, marginBottom: 10 }} >
                  {(request.employeeName?.[0] || "-").toUpperCase()}
                </div>
                <div>{request.employeeName}</div>
              </div>
              <div className="flex-grow-1">
                <div className="mb-2">
                  <strong>Start Date:</strong> {request.startDate}
                </div>
                <div className="mb-2">
                  <strong>End Date:</strong> {request.endDate}
                </div>
                <div className="mb-2">
                  <strong>Reason:</strong> {request.reason}
                </div>

                <Form.Group className="mt-3">
                  <Form.Label>
                    <strong>Status</strong>
                  </Form.Label>
                  <Form.Select value={status} onChange={handleStatusChange} className={ status === "Accepted" ? "bg-success text-white fw-bold"
                        : status === "Rejected" ? "bg-danger text-white fw-bold" : "bg-warning text-dark fw-bold" } >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          ) : (
            <p>No request data available.</p>
          )
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!request}>
          Save Status
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LeaveRequestModel;
