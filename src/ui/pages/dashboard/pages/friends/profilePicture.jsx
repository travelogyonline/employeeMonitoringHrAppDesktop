import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { BASE_API_URL } from "../../../../data";

export default function ProfileAvatar({ client, user }) {
    const [profilePic, setProfilePic] = useState(null)

    const clientUserId = client?._id;
    const hostUserId = user?._id;

    const fetchDp = async () => {
        try {
            const res = await axios.get(`${BASE_API_URL}api/dp/${clientUserId}`);
            if (res.data?.data?.length > 0) {
                setProfilePic(res.data.data[0].profilePicture);
            } else {
                setProfilePic(null)
            }
        } catch (err) {
        }
    };

    useEffect(() => {
        fetchDp();
    });

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append("image", file);

        try {
            await axios.post(`http://localhost:5000/api/dp/${clientUserId}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            fetchDp();
        } catch (err) {
            console.log("DP upload error:", err);
        }
    };

    return (
        <div style={{ position: "relative", width: 140, margin: "auto" }}>
            <Avatar
                src={profilePic || ""}
                sx={{
                    width: 120,
                    height: 120,
                    margin: "auto",
                    fontSize: 40,
                    bgcolor: "#1976d2",
                }}
            >
                {!profilePic && client?.staffName?.charAt(0)}
            </Avatar>

            {/* EDIT BUTTON */}
            {clientUserId===hostUserId && <IconButton
                sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 10,
                    background: "white",
                    boxShadow: 2,
                }}
                component="label"
            >
                <EditIcon />

                {/* Hidden file input */}
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleUpload}
                />
            </IconButton>}
        </div>
    );
}
