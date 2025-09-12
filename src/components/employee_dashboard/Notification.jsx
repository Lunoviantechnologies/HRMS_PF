import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton, Badge, Menu, MenuItem, Typography,} from "@mui/material";
import backendIP from "../../api";

export default function NotificationMenu({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (!user?.emailId) return; // wait for user info

    const client = new Client({
      webSocketFactory: () => new SockJS(`${backendIP}/HRMS/ws`),
      reconnectDelay: 5000,
      connectHeaders: {
        // Important: pass unique identifier (backend uses this for convertAndSendToUser)
        login: user.emailId,
      },
    });

    client.onConnect = () => {
      console.log("✅ Employee connected to WebSocket");

      // Subscribe to personal queue
      client.subscribe("/user/queue/notifications", (msg) => {
        try {
          const parsed = JSON.parse(msg.body);
          setNotifications((prev) => [...prev, parsed]);
        } catch {
          setNotifications((prev) => [
            ...prev,
            { type: "INFO", message: msg.body },
          ]);
        }
      });

      // (optional) Global or employee-only channel
      client.subscribe("/topic/employees", (msg) => {
        setNotifications((prev) => [...prev, { type: "EMPLOYEE", message: msg.body }]);
      });
    };

    client.onStompError = (frame) => {
      console.error("❌ Broker error:", frame.headers["message"]);
    };

    client.activate();

    return () => client.deactivate();
  }, [user]);

  // open/close menu
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
        PaperProps={{ style: { maxHeight: 300, width: "300px" } }}
      >
        {notifications.length === 0 && (
          <MenuItem disabled>No notifications</MenuItem>
        )}
        {notifications.map((n, i) => (
          <MenuItem key={i} onClick={handleClose}>
            <Typography variant="body2">
              <strong>{n.type || "INFO"}:</strong> {n.message}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

