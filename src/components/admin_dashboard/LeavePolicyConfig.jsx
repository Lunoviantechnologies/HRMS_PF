import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card as BsCard, Form, Button, Toast } from "react-bootstrap";
import backendIP from "../../api";
import { Box, Card, CardActionArea, CardContent, Typography,} from "@mui/material";
import { BeachAccess, Healing, BabyChangingStation, Work, Autorenew,} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const LeavePolicyConfig = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [policy, setPolicy] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const res = await axios.get(`${backendIP}/leavePolicy_table`, {
        headers: { Authorization: token },
      });

      if (Array.isArray(res.data) && res.data.length > 0) {
        setPolicy(res.data[0]); // ✅ take first object
      } else {
        setPolicy({});
      }
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
    console.log("Submitting Policy:", policy);
    try {
      await axios.put(`${backendIP}/leave_policy/${1}`, policy, {
        headers: { Authorization: token },
      });
      setShowToast(true);
      alert("Leave policy updated");
    } catch (error) {
      console.error("Error updating policy:", error);
      alert("Failed to update policy.");
    }
  };

  // Leave cards definition
  const cards = [
    {
      id: 1,
      title: "Annual Leave",
      description: `${policy.annualLeaves || 0} Days`,
      icon: <Work />,
    },
    {
      id: 2,
      title: "Casual Leave",
      description: `${policy.casualLeaves || 0} Days`,
      icon: <BeachAccess />,
    },
    {
      id: 3,
      title: "Sick Leave",
      description: `${policy.sickLeaves || 0} Days`,
      icon: <Healing />,
    },
    {
      id: 4,
      title: "Maternity Leave",
      description: `${policy.maternityLeaves || 0} Days`,
      icon: <BabyChangingStation />,
    },
    {
      id: 5,
      title: "Carry Forward Limit",
      description: `${policy.carryForwarelimit || 0} Days`,
      icon: <Autorenew />,
    },
  ];

  return (
    <div className="container mt-4">
      {/* Leave Cards Section */}
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 2,
          mb: 4,
        }}
      >
        {cards.map((card, index) => (
          <Card key={card.id} sx={{boxShadow: 5}}>
            <CardActionArea
              onClick={() => setSelectedCard(index)}
              data-active={selectedCard === index ? "" : undefined}
              sx={{
                height: "100%",
                "&[data-active]": {
                  backgroundColor: "action.selected",
                  "&:hover": { backgroundColor: "action.selectedHover" },
                },
              }}
            >
              <CardContent sx={{ height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {card.icon}
                  <Typography variant="h6">{card.title}</Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="right"
                >
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* Leave Policy Form */}
      <BsCard className="shadow">
        <BsCard.Header className="bg-info text-white">
          <h5 className="mb-0">Leave Policy Configuration</h5>
        </BsCard.Header>
        <BsCard.Body>
          <Form onSubmit={handleSubmit}>
            {[
              { label: "Annual Leave Days", name: "annualLeaves" },
              { label: "Casual Leave Days", name: "casualLeaves" },
              { label: "Sick Leave Days", name: "sickLeaves" },
              { label: "Maternity Leave Days", name: "maternityLeaves" },
              { label: "Carry Forward Limit", name: "carryForwarelimit" },
            ].map((field) => (
              <Form.Group className="mb-3" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type="number"
                  name={field.name}
                  value={policy[field.name] ?? ""}
                  onChange={handleChange}
                  disabled={loading} // ✅ disable until fetch done
                  required={field.name !== "maternityLeaves"}
                />
              </Form.Group>
            ))}

            <div className="d-grid">
              <Button type="submit" variant="primary" disabled={loading}>
                Save Policy
              </Button>
            </div>
          </Form>
        </BsCard.Body>
      </BsCard>

      {/* Success Toast */}
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
