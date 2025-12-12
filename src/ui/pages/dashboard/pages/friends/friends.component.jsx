import React, { useEffect, useState } from "react";
import {
    Box,
    Avatar,
    Typography,
    Divider,
    TextField,
    IconButton,
    Paper,
    Stack
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { BASE_API_URL } from "../../../../data";
import Thoughts from "./components/thoughts";
import ProfileAvatar from "./components/profilePicture";

export default function Friends({ friend, user }) {
    if (!friend) return (<h1>Please search a friend</h1>)
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
                setClient(response.data.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        refresh();
    }, [friend]);

    const dummyMessages = [
        { from: "me", text: "Hi there!" },
        { from: "friend", text: "Hello! How are you?" },
        { from: "me", text: "All good, working on the new chat module 😄" },
        { from: "friend", text: "Nice! Let me know when it's done!" }
    ];


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
                    </>
                    :
                    <>
                        <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: 600, borderBottom: "1px solid #ddd", pb: 1 }}
                        >
                            Chat with {client?.staffName}
                        </Typography>

                        {/* Chat Messages Area */}
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                px: 1
                            }}
                        >
                            {dummyMessages.map((msg, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent: msg.from === "me" ? "flex-end" : "flex-start"
                                    }}
                                >
                                    <Box
                                        sx={{
                                            bgcolor: msg.from === "me" ? "#1976d2" : "#e0e0e0",
                                            color: msg.from === "me" ? "#fff" : "#000",
                                            p: 1.2,
                                            borderRadius: 2,
                                            maxWidth: "40%"
                                        }}
                                    >
                                        {msg.text}
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        {/* Message Input */}
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <TextField
                                fullWidth
                                placeholder="Type a message..."
                                variant="outlined"
                                size="small"
                            />
                            <IconButton color="primary">
                                <SendIcon />
                            </IconButton>
                        </Stack>
                    </>
                }
            </Paper>
        </Box>
    );
}
