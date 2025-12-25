import { useState, useEffect, useContext } from "react";
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
import { ThemeStore } from "../../../../../store/userStore";

export default function MyThoughts({ user, updateUser }) {
  const [theme] = useContext(ThemeStore)
  const [thought, setThought] = useState(user.myThoughts);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  console.log("Theme: ", theme)

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
        color: theme.text
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
            // Input text
            "& .MuiInputBase-input": {
              color: theme.medium,
              fontSize: "0.875rem",
            },

            // Bottom border (default)
            "& .MuiInput-underline:before": {
              borderBottomColor: theme.medium,
            },

            // Bottom border on hover
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: theme.medium,
            },

            // Bottom border when focused
            "& .MuiInput-underline:after": {
              borderBottomColor: theme.medium,
            },
          }}
        />
        <Typography variant="caption" sx={{ color: theme.medium }}>
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
                background: theme.light,
                color: theme.dark,
                "&:hover": {
                  background: theme.medium,
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
