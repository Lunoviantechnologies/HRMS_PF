import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton, Badge, Menu, MenuItem, Typography } from "@mui/material";
import backendIP from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

export default function AdminNotifications() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const clientRef = useRef(null);

  // --- Handle WebSocket/STOMP ---
  useEffect(() => {
    if (!user?.sub || user.role !== "ADMIN") return;

    const handleMessage = (msg) => {
      try {
        const parsed = JSON.parse(msg.body);
        setNotifications((prev) => [...prev, parsed]);
      } catch {
        setNotifications((prev) => [
          ...prev,
          { type: "INFO", message: msg.body },
        ]);
      }
    };

    axios.get(`${backendIP}/api/notifications/${user.sub}`, {
      headers: { Authorization: token }
    })
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err));

    const client = new Client({
      webSocketFactory: () => new SockJS(`${backendIP}/ws`),
      connectHeaders: { email: user.sub },
      reconnectDelay: 5000,
      debug: (str) => console.log("🔌 STOMP:", str),
    });

    client.onConnect = () => {
      console.log("✅ Admin connected to WebSocket");
      client.subscribe("/user/queue/notifications", handleMessage);
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
        PaperProps={{ style: { maxHeight: 300, width: 350 } }}
      >
        {notifications.length === 0 && (
          <MenuItem disabled>No notifications</MenuItem>
        )}
        {notifications.map((n, i) => (
          <MenuItem key={i} onClick={handleClose}>
            <Typography
              variant="body2"
              sx={{ fontWeight: n.type === "LEAVE_REQUEST" ? "bold" : "normal" }}
            >
              <strong>{n.type || "INFO"}:</strong> {n.message}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}