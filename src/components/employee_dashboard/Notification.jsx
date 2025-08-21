// src/components/employee_dashboard/NotificationMenu.jsx
import React, { useState } from "react";
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

export default function NotificationMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Example notifications (you can replace with API data later)
  const notifications = [
    { id: 1, text: "Your leave request was approved 🎉" },
    { id: 2, text: "Salary credited for July 💰" },
    { id: 3, text: "Company meeting scheduled for tomorrow 📅" },
  ];

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
        // ✅ Fix aria-hidden warning
        disableAutoFocusItem
        disableScrollLock
      >
        <Typography variant="h6" sx={{ px: 2, py: 1 }}>
          Notifications
        </Typography>
        <Divider />

        {notifications.map((notif) => (
          <MenuItem key={notif.id} onClick={handleClose}>
            <ListItemText primary={notif.text} />
          </MenuItem>
        ))}

        {notifications.length === 0 && (
          <MenuItem disabled>
            <ListItemText primary="No new notifications 🎉" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
