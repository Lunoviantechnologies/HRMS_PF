import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import LeaveRequestModel from "./LeaveRequestModel";
import axios from "axios";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function LeaveRequest() {

  const { token } = useAuth();
  // console.log(token);

  const [leaveRequests, setLeaveRequests] = useState([]);
  // console.log(leaveRequests);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await axios.get(`${backendIP}/HRMS/api/leaves`);
        console.log(res.data);
        setLeaveRequests(res.data);
      } catch (err) {
        console.error('Leave request data not received', err);
      }
    };
    fetchLeaveRequests();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    // console.log(newStatus);
    try {
      await axios.put(`${backendIP}/HRMS/api/leaves/${id}/status`, { status: newStatus },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json"
          }
        }
      )
      const updatedRequests = leaveRequests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      );
      // console.log(updatedRequests);
      setLeaveRequests(updatedRequests);
      alert(`Leave status ${newStatus} updated for ID ${id}`);
    } catch (error) {
      console.error('Error updating status on the backend', error);
      alert('Failed to update leave status.');
    };
  };

  const handleView = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="container mt-4">
      <h5><strong>All Leave Requests</strong></h5>
      <Table bordered hover>
        <thead className="table-primary text-center">
          <tr>
            <th>Thumbnail</th>
            <th>Name</th>
            {/* <th>Department</th> */}
            <th>Leave Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            Array.isArray(leaveRequests) && leaveRequests.map((req) => (
              <tr key={req.id} className="text-center align-middle">
                <td>
                  <div style={{
                    backgroundColor: "#ccc", width: 40, height: 40, borderRadius: "50%", margin: "auto", display: "flex", justifyContent: "center",
                    alignItems: "center", fontSize: 14
                  }}
                  >
                    {(req.employeeName?.[0] || '-').toUpperCase()}
                  </div>
                </td>
                <td>{req.employeeName}</td>
                {/* <td>{req.department}</td> */}
                <td>{req.reason}</td>
                <td>{req.startDate}</td>
                <td>{req.endDate}</td>
                <td>
                  <span className={`badge ${req.status.toLowerCase() === "accepted" ? "bg-success" : req.status.toLowerCase() === "rejected" ? "bg-danger" :
                    "bg-warning text-dark"}`}
                  >
                    {req.status}
                  </span>
                </td>
                <td>
                  <Button variant="outline-primary" onClick={() => handleView(req)}> View </Button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
      <LeaveRequestModel
        show={showModal}
        onHide={handleClose}
        request={selectedRequest}
        onStatusUpdate={handleStatusUpdate} // ✅ Pass the handler
      />
    </div>
  );
}