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

export default function MyThoughts({ user, updateUser }) {
  const [thought, setThought] = useState(user.myThoughts);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Save thoughts
  const handleSave = async () => {
    if (!user?._id || saving) return;

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      await axios.patch(
        `${BASE_API_URL}api/user/thoughts/${user._id}`,
        {
          myThoughts: thought
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      setSaving(false);
      setSaved(true);
      updateUser();

      setTimeout(() => setSaved(false), 2000);
      setEditing(false);
    } catch (err) {
      setSaving(false);
      setError("Failed to save your thoughts.");
    }
  };

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
      {editing ? (<>
        <TextField
          variant="standard"
          fullWidth
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          autoFocus
          sx={{
            fontSize: "0.875rem", // matches body2
          }}
        />
        <Typography variant="caption" sx={{ color: "#999" }}>
          {thought.length} / 300
        </Typography>
      </>
      ) : (
        <Typography variant="body2">
          {thought}
        </Typography>
      )}
      <Box
        sx={{
          mt: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Save button area */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {saving ? (
            <CircularProgress size={20} />
          ) : saved ? (
            <CheckCircleIcon color="success" />
          ) : (
            <IconButton
              onClick={() => { !editing ? setEditing(true) : handleSave() }}
              sx={{
                background: "#7b68ee",
                color: "white",
                "&:hover": {
                  background: "#6a58d9",
                },
                borderRadius: 2,
                px: 2,
              }}
            >
              {!editing ? <EditNoteIcon /> : <SaveIcon />}
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Error Alert */}
      <Fade in={Boolean(error)}>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Fade>
    </Paper>
  );
}
