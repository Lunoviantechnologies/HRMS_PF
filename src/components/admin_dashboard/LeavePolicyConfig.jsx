import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Form, Button, Spinner, Toast } from "react-bootstrap";
import backendIP from "../../api";

const LeavePolicyConfig = () => {
  const [loading, setLoading] = useState(true);
  const [policy, setPolicy] = useState({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const res = await axios.get(`${backendIP}/HRMS/leave/policy`);
      setPolicy(res.data);
    } catch (error) {
      console.error("Error fetching policy:", error);
      alert("Failed to fetch policy.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPolicy((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendIP}/leave/policy/update`, policy);
      setShowToast(true);
    } catch (error) {
      console.error("Error updating policy:", error);
      alert("Failed to update policy.");
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow">
        <Card.Header className="bg-info text-white">
          <h5 className="mb-0">Leave Policy Configuration</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading leave policy...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {[
                { label: "Annual Leave Days", name: "annualLeaveDays" },
                { label: "Casual Leave Days", name: "casualLeaveDays" },
                { label: "Sick Leave Days", name: "sickLeaveDays" },
                { label: "Maternity Leave Days", name: "maternityLeaveDays" },
                { label: "Carry Forward Limit", name: "carryForwardLimit" },
              ].map((field) => (
                <Form.Group className="mb-3" key={field.name}>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type="number"
                    name={field.name}
                    value={policy[field.name] || ""}
                    onChange={handleChange}
                    required={field.name !== "maternityLeaveDays"}
                  />
                </Form.Group>
              ))}

              <div className="d-grid">
                <Button type="submit" variant="primary">
                  Save Policy
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        bg="success"
        className="position-fixed bottom-0 end-0 m-4 text-white"
      >
        <Toast.Body>Leave policy updated successfully!</Toast.Body>
      </Toast>
    </div>
  );
};

export default LeavePolicyConfig;
