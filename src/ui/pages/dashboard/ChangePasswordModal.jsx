import { useState } from "react";
import { Modal, Box, TextField, Typography, Button } from "@mui/material";
import axios from "axios";
import { BASE_API_URL } from "../../data.jsx";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2,
    boxShadow: 24
};

export default function ChangePasswordModal({ open, handleClose, user }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            return setError("All fields are required");
        }

        if (newPassword !== confirmPassword) {
            return setError("New passwords do not match");
        }

        if (newPassword.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        try {
            const res = await axios.patch(
                `${BASE_API_URL}api/user/change-password/${user._id}`,
                {
                    currentPassword,
                    newPassword
                }
            );

            setSuccess("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                handleClose();
                setSuccess("");
            }, 1500);

        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>Change Password</Typography>

                <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && (
                    <Typography sx={{ mt: 2 }} color="error">{error}</Typography>
                )}

                {success && (
                    <Typography sx={{ mt: 2, color: "green" }}>{success}</Typography>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleSubmit}
                >
                    Update Password
                </Button>
            </Box>
        </Modal>
    );
}
