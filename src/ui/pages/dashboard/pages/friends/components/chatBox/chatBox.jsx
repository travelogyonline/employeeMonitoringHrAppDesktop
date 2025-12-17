// import { io } from "socket.io-client";
import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Stack
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import getRoomId from "./functions/getRoom";
import { UserStore } from "../../../../../../store/userStore";
import { BASE_API_URL } from '../../../../../../data';
import socket from './functions/socket';
import axios from "axios";

const dummyMessages = [
    { from: "me", text: "Hi there!" },
    { from: "friend", text: "Hello! How are you?" },
    { from: "me", text: "All good, working on the new chat module 😄" },
    { from: "friend", text: "Nice! Let me know when it's done!" }
];

// const socket = io("http://localhost:5000");

function ChatBox({ client }) {
    const [hostUser, setHostUser] = useContext(UserStore);
    const [message, setMessage] = useState([]);
    const [text, setText] = useState('');
    const [roomID, setRoomID] = useState(null);
    useEffect(()=>{
        if(hostUser && client){
            setRoomID(getRoomId(client._id, hostUser._id))
        }
    },[client]);
    useEffect(() => {
        async function initChat() {
            socket.emit("join_room", roomID);
            const msgs = await axios.get(
                `${BASE_API_URL}api/message/${roomID}`
            );
            setMessage(msgs.data);
        }
        initChat();
    }, [roomID]);
    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            setMessage((prev) => [...prev, msg]);
        });

        return () => socket.off("receiveMessage");
    }, []);
    const sendMessage = () => {
        socket.emit("sendMessage", {
            roomID,
            senderId: hostUser._id,
            text
        });
        setText("");
    };
    return (
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
                {message && message.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            justifyContent: msg.senderId === hostUser._id ? "flex-end" : "flex-start"
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: msg.senderId === hostUser._id ? "#1976d2" : "#e0e0e0",
                                color: msg.senderId === hostUser._id ? "#fff" : "#000",
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
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <IconButton color="primary" onClick={sendMessage}>
                    <SendIcon />
                </IconButton>
            </Stack>
        </>
    )
}

export default ChatBox;