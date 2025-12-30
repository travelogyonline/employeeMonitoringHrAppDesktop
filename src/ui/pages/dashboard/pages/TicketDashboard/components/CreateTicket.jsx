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
import { UserStore } from "../../../../../store/userStore";

const CreateTicket = () => {
  const [hostUser] = useContext(UserStore);

  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "Medium",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  // Snackbar state
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
        `${BASE_API_URL}api/ticket/${hostUser._id}`,
        form
      );

      console.log("Ticket created:", data.ticket);

      // Success popup
      setSnackbar({
        open: true,
        message: "Ticket created successfully",
        severity: "success"
      });

      // Reset form
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
          borderRadius: 3
        }}
      >
        <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
          Create Ticket
        </Typography>

        <TextField
          fullWidth
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          fullWidth
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          <MenuItem value="Bug">Bug</MenuItem>
          <MenuItem value="Feature">Feature</MenuItem>
          <MenuItem value="Support">Support</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>

        <Button
          component="label"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          disabled
        >
          Upload Screenshot (coming soon)
          <input hidden type="file" />
        </Button>

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={4}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create Ticket"}
        </Button>
      </Paper>

      {/* POPUP */}
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
