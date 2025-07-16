import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import LeaveRequestModel from "./LeaveRequestModel";

export default function LeaveRequest() {

  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Sohan Yadav",
      department: "HR",
      leaveType: "Sick Leave",
      startDate: "2025-06-10",
      endDate: "2025-06-12",
      reason: "Fever and doctor appointment",
      status: "Pending",
    },
    {
      id: 2,
      name: "Mohan Singh",
      department: "Finance",
      leaveType: "Casual Leave",
      startDate: "2025-06-15",
      endDate: "2025-06-16",
      reason: "Family function",
      status: "Pending",
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleView = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const handleStatusUpdate = (id, newStatus) => {
    const updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status: newStatus } : req

    );
    setRequests(updatedRequests);
  };
  return (
    <div className="container mt-4">
      <h5><strong>All Leave Requests</strong></h5>
      <Table bordered hover>
        <thead className="table-primary text-center">
          <tr>
            <th>Thumbnail</th>
            <th>Name</th>
            <th>Department</th>
            <th>Leave Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="text-center align-middle">
              <td>
                <div
                  style={{
                    backgroundColor: "#ccc",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    margin: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 14,
                  }}
                >
                  {
                    req.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                  }
                </div>
              </td>
              <td>{req.name}</td>
              <td>{req.department}</td>
              <td>{req.leaveType}</td>
              <td>{req.startDate}</td>
              <td>{req.endDate}</td>
              <td>
                <span className={
                  `badge ${
                    req.status === "Accepted" ? "bg-success" :
                    req.status === "Rejected" ? "bg-danger" :
                    "bg-warning text-dark"
                  }`
                }>
                {req.status}
                </span>
              </td>
              <td>
                <Button variant="outline-primary" onClick={() => handleView(req)}> View </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <LeaveRequestModel
        show={showModal}
        onHide={() => setShowModal(false)}
        request={selectedRequest}
        onStatusUpdate={handleStatusUpdate} // ✅ Pass the handler
      />
    </div>
  );
}