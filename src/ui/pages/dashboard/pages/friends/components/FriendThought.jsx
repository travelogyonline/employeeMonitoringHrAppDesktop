import { useState, useEffect, useContext } from "react";
import {
  Typography,
  Paper
} from "@mui/material";
import { ThemeStore } from "../../../../../store/userStore";

export default function FriendThought({ friend }) {
  const [theme] = useContext(ThemeStore);
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Typography fontWeight={700} mb={1} sx={{ color: theme.text }}>
        Thoughts
      </Typography>
      {friend.myThoughts ? (
        <Typography variant="body2" sx={{ color: theme.text, mb: 2 }}>
          {friend.myThoughts}
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ color: theme.text, mb: 2 }}>
          No thoughts!
        </Typography>
      )}


    </Paper>
  );
}
