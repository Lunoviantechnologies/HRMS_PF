import React, { useEffect, useState } from "react";
import { Table, Button, Tabs, Tab } from "react-bootstrap";
import LeaveRequestModel from "./LeaveRequestModel";
import axios from "axios";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function LeaveRequest() {
  const { token } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await axios.get(`${backendIP}/api/leaves`, {
          headers: {
            Authorization: token
          }
        });
        // console.log(res.data);

        setLeaveRequests(res.data);
        setFilteredRequests(res.data); // initially show all
      } catch (err) {
        console.error("Leave request data not received", err);
      }
    };
    fetchLeaveRequests();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    // console.log(newStatus.toUpperCase());

    try {
      await axios.put(
        `${backendIP}/api/leaves/updateStatus/${id}`,
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
      console.error("Error updating status on the backend", error);
      alert("Failed to update leave status.");
    }
  };

  const handleView = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const applyFilter = (status, allRequests = leaveRequests) => {
    setSelectedTab(status);
    if (status === "ALL") {
      setFilteredRequests(allRequests);
    } else {
      const filtered = allRequests.filter((req) => req.status?.toLowerCase() === status.toLowerCase());
      setFilteredRequests(filtered);
    }
  };

  return (
    <div className="container mt-4">
      <h5>
        <strong>All Leave Requests</strong>
      </h5>

      <Tabs activeKey={selectedTab} onSelect={(k) => applyFilter(k)} className="mb-3" >
        <Tab eventKey="ALL" title="All" />
        <Tab eventKey="PENDING" title="Pending" />
        <Tab eventKey="ACCEPTED" title="Accepted" />
        <Tab eventKey="REJECTED" title="Rejected" />
      </Tabs>

      <Table bordered hover>
        <thead className="table-primary text-center">
          <tr>
            <th className="tableHeader_leaveList">Thumbnail</th>
            <th className="tableHeader_leaveList">Mail</th>
            <th className="tableHeader_leaveList">Leave Type</th>
            <th className="tableHeader_leaveList">Start</th>
            <th className="tableHeader_leaveList">End</th>
            <th className="tableHeader_leaveList">Status</th>
            <th className="tableHeader_leaveList">Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredRequests) && filteredRequests.length > 0 ? (
            filteredRequests.map((req) => {
              const status = req.status?.toLowerCase();
              return (
                <tr key={req.id} className="text-center align-middle">
                  <td>
                    <div style={{
                      backgroundColor: "#ccc", width: 40, height: 40, borderRadius: "50%", margin: "auto", display: "flex", justifyContent: "center",
                      alignItems: "center", fontSize: 14
                    }}
                    >
                      {(req.employeeEmail?.[0] || "-").toUpperCase()}
                    </div>
                  </td>
                  <td>{req.employeeEmail}</td>
                  <td>{req.leaveType}</td>
                  <td>{req.startDate}</td>
                  <td>{req.endDate}</td>
                  <td>
                    <span
                      className={`badge ${status === "accepted"
                        ? "bg-success"
                        : status === "rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                        }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleView(req)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-3">
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <LeaveRequestModel
        show={showModal}
        onHide={handleClose}
        request={selectedRequest}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};