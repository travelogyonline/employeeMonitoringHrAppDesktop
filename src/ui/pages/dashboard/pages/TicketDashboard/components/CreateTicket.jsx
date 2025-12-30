import { useContext, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import axios from "axios";
import { BASE_API_URL } from "../../../../../data";
import { LanguageStore, ThemeStore } from "../../../../../store/userStore";
import translate from "../../../../../language/translate";

const CreateTicket = ({ userId, userName }) => {
  const [theme] = useContext(ThemeStore);
  const [language] = useContext(LanguageStore)

  const [form, setForm] = useState({
    createdName: userName,
    title: "",
    category: "",
    priority: "Medium",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCreate = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${BASE_API_URL}api/ticket/${userId}`,
        form
      );

      console.log("Ticket created:", data.ticket);

      setSnackbar({
        open: true,
        message: "Ticket created successfully",
        severity: "success"
      });

      setForm({
        title: "",
        category: "",
        priority: "Medium",
        description: ""
      });

    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to create ticket. Please try again.",
        severity: "error"
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          background: theme.medium
        }}
      >
        <Typography variant="h5" fontWeight={700} textAlign="center" mb={3} sx={{ color: theme.text }}>
          {translate(language, "createTicket")}
        </Typography>

        <TextField
          fullWidth
          label={translate(language, "title")}
          name="title"
          value={form.title}
          onChange={handleChange}
          sx={{
            mb: 2,
            backgroundColor: theme.light,

            "& .MuiInputLabel-root": {
              color: theme.dark,
            },

            "& .MuiInputBase-input": {
              color: theme.medium,
            },
          }}
        />

        <TextField
          select
          fullWidth
          label={translate(language, "category")}
          name="category"
          value={form.category}
          onChange={handleChange}
          sx={{
            mb: 2,
            backgroundColor: theme.light,

            "& .MuiInputLabel-root": {
              color: theme.dark,
            },

            "& .MuiInputBase-input": {
              color: theme.medium,
            },
          }}
        >
          <MenuItem sx={{ color: theme.medium }} value="Bug">Bug</MenuItem>
          <MenuItem sx={{ color: theme.medium }} value="Feature">Feature</MenuItem>
          <MenuItem sx={{ color: theme.medium }} value="Support">Support</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label={translate(language, "priority")}
          name="priority"
          value={form.priority}
          onChange={handleChange}
          sx={{
            mb: 2,
            backgroundColor: theme.light,

            "& .MuiInputLabel-root": {
              color: theme.dark,
            },
            "& .MuiInputBase-input": {
              color: theme.medium,
            },
          }}
        >
          <MenuItem sx={{ color: theme.medium }} value="Low">Low</MenuItem>
          <MenuItem sx={{ color: theme.medium }} value="Medium">Medium</MenuItem>
          <MenuItem sx={{ color: theme.medium }} value="High">High</MenuItem>
        </TextField>

        <Button
          component="label"
          variant="outlined"
          fullWidth
          sx={{
            mb: 2,
            background: theme.light,
            color: theme.medium
          }}
        >
          {translate(language, "uploadScreenshot")}
        </Button>

        <TextField
          fullWidth
          label={translate(language, "description")}
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={4}
          sx={{
            mb: 3,
            background: theme.light,
            "& .MuiInputLabel-root": {
              color: theme.dark,
            },
            "& .MuiInputBase-input": {
              color: theme.medium,
            },
          }}
        />

        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleCreate}
          disabled={loading}
          sx={{
            backgroundColor: theme.dark,
            color: theme.text,
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: theme.text }} /> : "Create Ticket"}
        </Button>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateTicket;
