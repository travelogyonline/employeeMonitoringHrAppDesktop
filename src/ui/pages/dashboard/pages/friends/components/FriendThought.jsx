import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Fade,
  Alert,
  IconButton,
  Paper
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from '@mui/icons-material/Save';

import { BASE_API_URL } from "../../../../../data";

export default function FriendThought({ friend }) {
  console.log("friend: ", friend)
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
      <Typography fontWeight={700} mb={1}>
        Thoughts
      </Typography>
      {friend.myThoughts ? (
        <Typography variant="body2">
          No thoughts!
        </Typography>
      ) : (
        <Typography variant="body2">
          {friend.myThoughts}
        </Typography>
      )}

    </Paper>
  );
}
