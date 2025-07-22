import React from "react";
import { Box } from "@mui/material";

interface NotificationBadgeProps {
  count: number;
  visible?: boolean;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  count, 
  visible = true 
}) => {
  if (!visible || count === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: "#FF4444",
        color: "#fff",
        fontSize: "0.75rem",
        fontWeight: "bold",
        minWidth: "20px",
        height: "20px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingX: "6px",
      }}
    >
      {count > 99 ? "99+" : count}
    </Box>
  );
};

export default NotificationBadge;
