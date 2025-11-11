import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton, Badge, Menu, MenuItem, Typography } from "@mui/material";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function NotificationMenu() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!user?.sub) return;

    const handleMessage = (msg) => {
      console.log("🔔 WebSocket message received:", msg);
      try {
        const parsed = JSON.parse(msg.body);
        setNotifications((prev) => [...prev, parsed]);
      } catch {
        setNotifications((prev) => [...prev, { type: "INFO", message: msg.body }]);
      }
    };


    axios.get(`${backendIP}/api/notifications/${user.sub}`, {
      headers: { Authorization: token }
    })
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err));

    const client = new Client({
      webSocketFactory: () => new SockJS(`${backendIP}/ws`),
      connectHeaders: { email: user.sub }, // FIXED HEADER
      reconnectDelay: 5000,
      debug: (str) => console.log("🔌 STOMP:", str),
    });

    client.onConnect = () => {
      console.log("✅ Employee connected");
      client.subscribe("/user/queue/notifications", msg => {
        console.log("🔔 Received WebSocket message:", msg.body);
        handleMessage(msg);
      });
    };


    client.onStompError = (frame) => {
      console.error("❌ Broker error:", frame.headers["message"]);
    };

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, [user]);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      {/* Notification Bell */}
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 380,
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#fdfdfd",
          },
        }}
      >
        {notifications.length === 0 && (
          <MenuItem disabled>
            <Typography variant="body1" sx={{ color: "gray", textAlign: "center" }}>
              No notifications
            </Typography>
          </MenuItem>
        )}

        {notifications.map((n, i) => (
          <MenuItem
            key={i}
            onClick={handleClose}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 0.5,
              p: 1.5,
              mb: 1,
              borderRadius: "10px",
              backgroundColor: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "#3f51b5", fontSize: "0.9rem", }}
            >
              {n.type || "INFO"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.9rem",
                lineHeight: 1.6,
                color: "#333",
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {n.message}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};