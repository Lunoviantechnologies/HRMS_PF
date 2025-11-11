import React, { useEffect, useState } from "react";
import { Table, Button, Tabs, Tab, Pagination } from "react-bootstrap";
import LeaveRequestModel from "./LeaveRequestModel";
import axios from "axios";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function LeaveRequest() {
  const { token, user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await axios.get(`${backendIP}/api/leaves`, {
          headers: { Authorization: token },
        });

        // ✅ Sort latest start date first
        const sortedData = res.data.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );

        setLeaveRequests(sortedData);
        setFilteredRequests(sortedData);
      } catch (err) {
        console.error("Leave request data not received", err);
      }
    };
    fetchLeaveRequests();
  }, [token]);

  const handleStatusUpdate = async (id, newStatus) => {
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

      // ✅ Keep sorting after status update
      const sortedUpdatedRequests = updatedRequests.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );

      setLeaveRequests(sortedUpdatedRequests);
      applyFilter(selectedTab, sortedUpdatedRequests);

      const leaveReq = leaveRequests.find((req) => req.id === id);
      if (leaveReq) {
        const notificationPayload = {
          senderEmail: user.sub,
          receiverEmail: leaveReq.employeeEmail,
          actionType:
            newStatus.toUpperCase() === "ACCEPTED"
              ? "LEAVE_APPROVED"
              : newStatus.toUpperCase() === "REJECTED"
                ? "LEAVE_REJECTED"
                : "LEAVE_UPDATE",
          message: `Your leave request from ${leaveReq.startDate} to ${leaveReq.endDate} has been ${newStatus}.`,
        };

        try {
          await axios.post(
            `${backendIP}/api/notifications/send`,
            notificationPayload,
            {
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("📤 Leave notification sent successfully");
        } catch (notifyErr) {
          console.error("❌ Failed to send notification:", notifyErr);
        }
      }

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
    setCurrentPage(1);

    let filtered = [];
    if (status === "ALL") {
      filtered = allRequests;
    } else {
      filtered = allRequests.filter(
        (req) => req.status?.toLowerCase() === status.toLowerCase()
      );
    }

    // ✅ Sort filtered data also by startDate (latest first)
    const sortedFiltered = filtered.sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate)
    );

    setFilteredRequests(sortedFiltered);
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRequests.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRequests.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-4">
      <h5>
        <strong>All Leave Requests</strong>
      </h5>

      <Tabs
        activeKey={selectedTab}
        onSelect={(k) => applyFilter(k)}
        className="mb-3"
      >
        <Tab eventKey="ALL" title="All" />
        <Tab eventKey="PENDING" title="Pending" />
        <Tab eventKey="ACCEPTED" title="Accepted" />
        <Tab eventKey="REJECTED" title="Rejected" />
      </Tabs>

      <div style={{ minHeight: "450px" }}>
        <Table bordered hover>
          <thead className="table-primary text-center">
            <tr>
              <th className="tableHeader_leaveList">Thumbnail</th>
              <th className="tableHeader_leaveList">Mail</th>
              <th className="tableHeader_leaveList">Leave Type</th>
              <th className="tableHeader_leaveList">Start <i className="bi bi-sort-down-alt"></i></th>
              <th className="tableHeader_leaveList">End</th>
              <th className="tableHeader_leaveList">Status</th>
              <th className="tableHeader_leaveList">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(currentRecords) && currentRecords.length > 0 ? (
              currentRecords.map((req) => {
                const status = req.status?.toLowerCase();
                return (
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      <LeaveRequestModel
        show={showModal}
        onHide={handleClose}
        request={selectedRequest}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};