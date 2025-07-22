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
        backgroundColor: "#EDB528",
        color: "grey",
        fontSize: "0.8rem",
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
