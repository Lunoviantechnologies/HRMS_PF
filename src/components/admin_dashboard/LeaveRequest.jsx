import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Badge } from "react-bootstrap";
// import LeaveRequestModal from "./LeaveRequestModal"; // Ensure this modal is created
import LeaveRequestModal from "./LeaveRequestModel";
import backendIP from "../../api"; // e.g., "http://192.168.1.58:2020"

const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    // console.log(newStatus.toUpperCase());
    
    try {
      await axios.put(
        `${backendIP}/HRMS/api/leaves/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      const updatedRequests = leaveRequests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      );
      setLeaveRequests(updatedRequests);
      applyFilter(selectedTab, updatedRequests);
      alert(`Leave status ${newStatus} updated for ID ${id}`);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      await axios.put(`${backendIP}/HRMS/api/leaves/updateStatus/${id}`, {
        status,
      });
      fetchLeaveRequests(); // Refresh after update
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const statusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return <Badge bg="success">ACCEPTED</Badge>;
      case "rejected":
        return <Badge bg="danger">REJECTED</Badge>;
      case "pending":
        return <Badge bg="warning" text="dark">PENDING</Badge>;
      default:
        return <Badge bg="secondary">{status.toUpperCase()}</Badge>;
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Leave Requests</h4>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Employee Name</th>
              <th>From</th>
              <th>To</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.employeeName}</td>
                <td>{req.startDate}</td>
                <td>{req.endDate}</td>
                <td>{req.leaveType}</td>
                <td>{statusBadge(req.status)}</td>
                <td>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setSelectedRequest(req);
                      setShowModal(true);
                    }}
                  >
                    View & Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {selectedRequest && (
        <LeaveRequestModal
          show={showModal}
          onHide={() => setShowModal(false)}
          request={selectedRequest}
          onStatusUpdate={updateLeaveStatus}
        />
      )}
    </div>
  );
};

export default LeaveRequest;
