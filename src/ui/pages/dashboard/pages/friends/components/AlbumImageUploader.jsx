import React, { useState, useContext } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress, Alert, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import { UserStore } from "../../../../../store/userStore";
import { BASE_API_URL } from "../../../../../data";

export default function AlbumImageUploader({refresh}) {
  const [hostUser] = useContext(UserStore);
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
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 6, color: 'black' }}>
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#000000ff", mb: 2, display: "flex", alignItems: "center", gap: 1 }}
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
            border: "2px dashed rgba(255,255,255,0.3)",
            borderRadius: 2,
            cursor: "pointer",
            transition: "0.3s",
            '&:hover': { borderColor: "rgba(0, 0, 0, 0.6)" },
          }}
        >
          <CloudUploadIcon sx={{ color: "rgba(0, 0, 0, 0.7)", mb: 1 }} />
          <Typography variant="body2" sx={{ color: "rgba(0, 0, 0, 0.7)" }}>
            Click to select an image
          </Typography>
          <input hidden type="file" accept="image/*" onChange={handleFileChange} />
        </Box>

        {preview && (
          <Box sx={{ mt: 2 }}>
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
            borderRadius: 2,
            background: "linear-gradient(135deg, #6366f1, #9333ea)",
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
