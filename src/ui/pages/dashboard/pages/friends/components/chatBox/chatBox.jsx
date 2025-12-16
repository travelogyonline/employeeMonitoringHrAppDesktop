import { io } from "socket.io-client";
import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Stack
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { BASE_API_URL } from "../../../../../../data";
import getRoomId from "./functions/getRoom";
import { UserStore } from "../../../../../../store/userStore";
const dummyMessages = [
    { from: "me", text: "Hi there!" },
    { from: "friend", text: "Hello! How are you?" },
    { from: "me", text: "All good, working on the new chat module 😄" },
    { from: "friend", text: "Nice! Let me know when it's done!" }
];

const socket = io("http://localhost:5000");

function ChatBox({ client }) {
    const [hostUser, setHostUser] = useContext(UserStore);
    const [message, setMessage] = useState(null);
    const [text, setText] = useState('');
    const roomID = getRoomId(client._id, hostUser._id)
    useEffect(() => {
        socket.emit("join_room", roomId);
    }, [roomID]);
    return (
        <>
            <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, borderBottom: "1px solid #ddd", pb: 1 }}
            >
                Chat with {client?.staffName}
            </Typography>

            {/* Chat Messages Area */}
            {/* <Box
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
            </Box> */}
            <Box>
                {messages.map((msg, i) => (
                    <Box
                        key={i}
                        sx={{
                            alignSelf: msg.senderId === user._id ? "flex-end" : "flex-start",
                            bgcolor: msg.senderId === user._id ? "#6366f1" : "#333",
                            color: "#fff",
                            p: 1.5,
                            borderRadius: 2,
                            mb: 1,
                            maxWidth: "70%",
                        }}
                    >
                        {msg.message}
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
                    value={text}
                    onChange={(e)=>console.log("text: ", e)}
                />
                <IconButton color="primary">
                    <SendIcon />
                </IconButton>
            </Stack>
        </>
    )
}

export default ChatBox;