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

import { BASE_API_URL } from "../../../../data";

export default function Thoughts({ user, updateUser }) {
  const [thought, setThought] = useState("");
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
    } catch (err) {
      setSaving(false);
      setError("Failed to save your thoughts.");
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: "80%",
        p: 3,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f9fafb, #ffffff)",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        What's in my mind
      </Typography>

      <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
        Write your thoughts, feelings, updates…  
      </Typography>

      <TextField
        multiline
        minRows={4}
        maxRows={8}
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        placeholder="Share your thoughts…"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            backgroundColor: "#fff",
            transition: "0.2s",
            "&:hover fieldset": { borderColor: "#7b68ee" },
            "&.Mui-focused fieldset": {
              borderColor: "#7b68ee",
              boxShadow: "0 0 0 3px rgba(123, 104, 238, 0.2)",
            },
          },
        }}
      />

      <Box
        sx={{
          mt: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Character counter */}
        <Typography variant="caption" sx={{ color: "#999" }}>
          {thought.length} / 300
        </Typography>

        {/* Save button area */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {saving ? (
            <CircularProgress size={20} />
          ) : saved ? (
            <CheckCircleIcon color="success" />
          ) : (
            <IconButton
              onClick={handleSave}
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
              <EditNoteIcon />
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
