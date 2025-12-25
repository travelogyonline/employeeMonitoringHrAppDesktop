import React, { useState, useContext } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress, Alert, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import { ThemeStore, UserStore } from "../../../../../store/userStore";
import { BASE_API_URL } from "../../../../../data";

export default function AlbumImageUploader({ refresh }) {
  const [hostUser] = useContext(UserStore);
  const [theme] = useContext(ThemeStore);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      await axios.post(
        `${BASE_API_URL}api/album/${hostUser._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess(true);
      refresh();
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", color: 'black' }}>
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: theme.light,
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "black",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: theme.dark, mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <ImageIcon fontSize="small" /> Upload to Album
        </Typography>

        <Box
          component="label"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            border: `2px dashed ${theme.dark}`,
            color: theme.dark,
            borderRadius: 2,
            cursor: "pointer",
            transition: "0.3s",
            '&:hover': { borderColor: theme.medium, color: theme.medium},
          }}
        >
          <CloudUploadIcon sx={{ mb: 1 }} />
          <Typography variant="body2" >
            Click to select an image
          </Typography>
          <input hidden type="file" accept="image/*" onChange={handleFileChange} />
        </Box>

        {preview && (
          <Box
            sx={{
              mt: 'auto',
              display: 'flex',          // Enables Flexbox
              justifyContent: 'center', // Centers horizontally
              alignItems: 'center',     // Centers vertically
              width: '100%',            // Ensures it takes up the full width of the parent
              py: 2                     // Adds a little padding for breathing room
            }}
          >
            <Box
              component="img"
              src={preview}
              alt="preview"
              sx={{
                width: 50,
                height: 50,
                borderRadius: 1,
                objectFit: "cover",
                boxShadow: 2,
              }}
            />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>Image uploaded successfully</Alert>}

        <Button
          fullWidth
          variant="contained"
          onClick={handleUpload}
          disabled={loading}
          sx={{
            mt: 3,
            py: 1.2,
            color: theme.text,
            borderRadius: 2,
            background: theme.dark,
            '&:hover': { opacity: 0.9 },
          }}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {loading ? "Uploading..." : "Upload Image"}
        </Button>
      </Box>
    </Box>
  );
}
