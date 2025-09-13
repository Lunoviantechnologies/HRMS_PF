import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton, Badge, Menu, MenuItem, Typography } from "@mui/material";
import backendIP from "../../../api";
import { useAuth } from "../../../context/AuthContext";

export default function AdminNotifications() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (!user?.role || user.role !== "ADMIN") return;
    console.log("Testing...");
    const client = new Client({
      webSocketFactory: () => new SockJS(`${backendIP}/HRMS/ws`),
      connectHeaders : {
        Authorization : token
      },
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ Admin connected to WebSocket...");

      // Subscribe to admin-specific topic
      client.subscribe("/topic/admin", (msg) => {handleMessage(msg); console.log(msg.body)});

      // Subscribe personal queue
      client.subscribe("/user/queue/notifications", (msg) => {handleMessage(msg); console.log(msg.body)});
    };

    client.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    };

    const handleMessage = (msg) => {
      console.log("📩 Raw WebSocket message:", msg);
      try {
        const parsed = JSON.parse(msg.body);
        console.log("✅ Parsed message:", parsed);
        setNotifications((prev) => [...prev, parsed]);
      } catch {
        console.log("⚠️ Non-JSON message received:", msg.body);
        setNotifications((prev) => [...prev, { type: "INFO", message: msg.body }]);
      }
    };

    client.activate();
    return () => client.deactivate();
  }, [user]);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
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
        {notifications.length === 0 && <MenuItem disabled>No notifications</MenuItem>}

        {notifications.map((n, i) => (
          <MenuItem key={i} onClick={handleClose}>
            <Typography
              variant="body2"
              sx={{
                color: n.type === "LEAVE_REQUEST" ? "blue" : "black",
                fontWeight: n.type === "LEAVE_REQUEST" ? "bold" : "normal",
              }}
            >
              <strong>{n.type || "INFO"}:</strong> {n.message}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}




