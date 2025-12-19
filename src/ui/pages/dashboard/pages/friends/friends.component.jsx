import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Divider,
    Paper,
} from "@mui/material";
import axios from "axios";
import { BASE_API_URL } from "../../../../data";
import Thoughts from "./components/thoughts";
import ProfileAvatar from "./components/profilePicture";
import Album from "./components/album";
import AlbumImageUploader from "./components/AlbumImageUploader";
import ChatBox from "./components/chatBox/chatBox";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

export default function Friends({ friend, user }) {
    if (!friend)
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 4,
                        background:
                            "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,247,250,0.9))",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                    }}
                >
                    <PersonSearchIcon
                        sx={{
                            fontSize: 56,
                            color: "text.secondary",
                            mb: 1.5,
                        }}
                    />

                    <Typography variant="h6" fontWeight={700}>
                        No Friend Selected
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Search and select a friend to see their thoughts and albums.
                    </Typography>
                </Paper>
            </Box>
        );

    const [imageRefresher, setImageRefresh] = useState(null);
    const [client, setClient] = useState(null);

    function refresh() {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_API_URL}api/user/${friend._id}`,
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `${BASE_API_URL}api/dp/${friend._id}`,
                    headers: {}
                };
                axios.request(config)
                    .then((res) => {
                        let newClient = {
                            ...response.data.data
                        }
                        if (res.data.data[0]) {
                            newClient = {
                                ...newClient,
                                profilePicture: res.data.data[0].profilePicture,
                            }
                        }
                        setClient(newClient)

                    })
            })
            .catch((error) => {
                // console.log(error);
            });
    }
    useEffect(() => {
        refresh();
    }, [friend]);

    return (
        <Box sx={{ display: "flex", p: 2, gap: 2 }}>
            {/* LEFT SECTION — FRIEND PROFILE */}
            <Paper
                elevation={3}
                sx={{ width: "30%", p: 3, borderRadius: 3, overflowY: "auto" }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        p: 2,
                    }}
                >
                    {/* Left Section */}
                    <Box sx={{ textAlign: "center", minWidth: 120 }}>
                        <ProfileAvatar client={client} user={user} />

                        <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                            {client?.staffName}
                        </Typography>

                        <Typography variant="body1" sx={{ color: "gray" }}>
                            --{client?.designation || "Employee"}
                        </Typography>
                    </Box>

                    {/* Vertical Divider */}
                    <Divider orientation="vertical" flexItem />

                    {/* Right Section */}
                    <Box sx={{ textAlign: "left", lineHeight: 1.8 }}>
                        <Typography>{client?.staffEmail}</Typography>
                        <Typography>{client?.staffPhone}</Typography>
                        <Typography>{client?.role}</Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />
                {client?.myThoughts && <Box sx={{ mt: 1 }}>
                    <Typography><b>My thoughts!</b></Typography>
                    <Typography>{client?.myThoughts}</Typography>
                </Box>}

                <Divider sx={{ my: 3 }} />
                <Album friend={client} user={user} imageRefresher={imageRefresher} />

            </Paper>

            {/* RIGHT SECTION — CHAT BOX */}
            <Paper
                elevation={3}
                sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    width: "30%"
                }}
            >
                {friend._id === user._id ?
                    <>
                        <Thoughts user={user} updateUser={() => refresh()} />
                        <AlbumImageUploader refresh={() => setImageRefresh(Math.floor(Math.random() * 1000))} />
                    </>
                    :
                    <ChatBox client={client} />
                }
            </Paper>
        </Box>
    );
}
