import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton, Badge, Menu, MenuItem, Typography } from "@mui/material";
import backendIP from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function NotificationMenu() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // console.log("🔍 Current user object:", user);
    if (!user?.sub) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${backendIP}/ws`),
      reconnectDelay: 5000,
      // connectHeaders: {
      //   // Spring uses Principal name internally, ensure unique
      //   login: user.sub,
      // },
    });

    client.onConnect = () => {
      console.log("✅ Employee connected to WebSocket");

      // Personal queue (convertAndSendToUser)
      client.subscribe("/user/queue/notifications", (msg) => {
        console.log("📩 From /user/queue/notifications:", msg.body);
        handleMessage(msg);
      });

      if (user.employeeId) {
        client.subscribe(`/topic/employee/${user.employeeId}`, (msg) => {
          console.log("📩 /topic/employee:", msg.body);
          handleMessage(msg);
        });
      }

      client.subscribe("/topic/employees", (msg) => {
        console.log("📩 From /topic/employees:", msg.body);
        handleMessage(msg, "BROADCAST");
      });
    };

    client.onStompError = (frame) => {
      console.error("❌ Broker error:", frame.headers["message"]);
    };

    const handleMessage = (msg, forcedType) => {
      try {
        const parsed = JSON.parse(msg.body);
        setNotifications((prev) => [
          ...prev,
          forcedType ? { ...parsed, type: forcedType } : parsed,
        ]);
      } catch {
        setNotifications((prev) => [
          ...prev,
          { type: forcedType || "INFO", message: msg.body },
        ]);
      }
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
