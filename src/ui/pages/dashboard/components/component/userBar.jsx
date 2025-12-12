import { useContext, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { DpStore, UserStore } from "../../../../store/userStore";

export default function UserProfileBar() {
    const [hostUser, setHostUser] = useContext(UserStore);
    const [hostDp, setHostDp] = useContext(DpStore);
    const name = hostUser?.staffName || "User";

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
                src={hostDp}
                sx={{
                    width: 36,
                    height: 36,
                    fontSize: 18,
                    bgcolor: "#1976d2",
                }}
            >
                {!hostDp && name.charAt(0)}
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
