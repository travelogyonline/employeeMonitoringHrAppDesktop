import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";

export default function UserProfileBar({ user }) {
    const [profilePic, setProfilePic] = useState("");

    console.log("user inside profile bar: ", user)

    const userId = user?._id;
    const name = user?.staffName || "User";

    useEffect(() => {
        if (!userId) return;

        const fetchDp = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/dp/${userId}`);

                if (res.data?.data?.length > 0) {
                    setProfilePic(res.data.data[0].profilePicture);
                }
            } catch (err) {
                console.log("Error fetching profile pic:", err);
            }
        };

        fetchDp();
    }, [userId]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.3,
                padding: "6px 10px",
                borderRadius: "999px",
                cursor: "pointer",
                transition: "0.25s ease",
                "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                    transform: "translateY(-1px)",
                },
            }}
        >
            <Avatar
                src={profilePic}
                sx={{
                    width: 36,
                    height: 36,
                    fontSize: 18,
                    bgcolor: "#1976d2",
                }}
            >
                {!profilePic && name.charAt(0)}
            </Avatar>

            <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <Typography
                    sx={{
                        fontSize: "0.72rem",
                        opacity: 0.75,
                        marginBottom: "-2px",
                    }}
                >
                    Welcome,
                </Typography>

                <Typography
                    sx={{
                        fontSize: "0.86rem",
                        fontWeight: 600,
                        letterSpacing: 0.3,
                    }}
                >
                    {name}
                </Typography>
            </Box>
        </Box>
    );
}
