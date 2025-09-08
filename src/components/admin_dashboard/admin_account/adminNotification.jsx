import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Badge,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import backendIP from "../../api"; 

export default function NotificationMenu({ userRole, employeeId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchNotifications = async () => {
    try {
      let url = "";
      if (userRole === "admin") {
        url = `${backendIP}/api/notifications/admin`;
      } else {
        url = `${backendIP}/api/notifications/employee/${employeeId}`;
      }

      const token = localStorage.getItem("token"); 
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(res.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-controls={open ? "notification-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon className="text-white" />
        </Badge>
      </IconButton>

      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableAutoFocusItem
        disableScrollLock
      >
        <Typography variant="h6" sx={{ px: 2, py: 1 }}>
          {userRole === "admin" ? "Admin Notifications" : "Your Notifications"}
        </Typography>
        <Divider />

        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <MenuItem key={notif.id} onClick={handleClose}>
              <ListItemText primary={notif.message} />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <ListItemText primary="No new notifications 🎉" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
