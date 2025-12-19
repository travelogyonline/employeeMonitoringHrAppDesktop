import { useState, useEffect, useRef } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Paper,
    Avatar,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import socket from "../functions/socket";
import { BASE_API_URL } from "../../../../../data";

/* ---------------- DUMMY DATA ---------------- */
// const initialMessages = [
//     { id: 1, sender: "them", text: "Hey!" },
//     { id: 2, sender: "me", text: "Hello!" },
//     { id: 3, sender: "them", text: "How are you doing!?" },
//     { id: 4, sender: "me", text: "I am doing good! What about you?" },
//     { id: 5, sender: "them", text: "All Good..." },
// ];

function MessageBox({ activeUser }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        async function initChat() {
            socket.emit("join_room", activeUser.roomID);
            const msgs = await axios.get(
                `${BASE_API_URL}api/message/${activeUser.roomID}`
            );
            console.log(msgs.data)
            setMessages(msgs.data);
        }
        initChat();
    }, [activeUser]);

    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);

            // 🔔 Notify ONLY for incoming messages
            console.log("client: ", client);
            // if (msg.senderId !== activeUser.hostId) {
            //     window.electron?.notify({
            //         title: `New message from ${msg.senderName}`,
            //         body: msg.text
            //     });
            // }
        });

        return () => socket.off("receiveMessage");
    }, []);
    const sendMessage = () => {
        socket.emit("sendMessage", {
            roomID: activeUser.roomID,
            senderId: activeUser.hostId,
            senderName: activeUser.hostName,
            text: input
        });
        setInput("");
    };

    const bottomRef = useRef(null);

    /* Auto-scroll on new message */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* ---------------- EMPTY STATE ---------------- */
    if (!activeUser) {
        return (
            <Box
                sx={{
                    height: "100%",
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
                        maxWidth: 360,
                        background:
                            "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,247,250,0.95))",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                    }}
                >
                    <ChatBubbleOutlineIcon
                        sx={{
                            fontSize: 56,
                            color: "text.secondary",
                            mb: 1.5,
                        }}
                    />

                    <Typography variant="h6" fontWeight={700}>
                        No Conversation Selected
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Select an existing conversation or start a new one to begin chatting.
                    </Typography>
                </Paper>
            </Box>
        );
    }

    /* ---------------- CHAT VIEW ---------------- */
    return (
        <>
            {/* Header */}
            <Paper
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 3,
                    bgcolor: "#FFFFFF",
                }}
            >
                <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: "#2F5BFF", mr: 2 }} />
                    <Typography fontWeight={600}>
                        {activeUser.clientName}
                    </Typography>
                </Box>
            </Paper>
            {/* Messages */}
            <Box
                flex={1}
                px={1}
                sx={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        display="flex"
                        justifyContent={
                            msg.senderId === activeUser.hostId ? "flex-end" : "flex-start"
                        }
                        mb={2}
                    >
                        <Paper
                            elevation={1}
                            sx={{
                                p: 1.5,
                                maxWidth: "60%",
                                borderRadius: 3,
                                bgcolor:
                                    msg.senderId === activeUser.hostId ? "#FFFFFF" : "#FFF0C2",
                                wordBreak: "break-word",
                            }}
                        >
                            <Typography variant="body2">
                                {msg.text}
                            </Typography>
                        </Paper>
                    </Box>
                ))}
                <div ref={bottomRef} />
            </Box>

            {/* Input */}
            <Paper
                sx={{
                    mt: 2,
                    p: 1,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#FFFFFF",
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Type your message here..."
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <IconButton onClick={sendMessage} color="primary">
                    <SendIcon />
                </IconButton>
            </Paper>
        </>
    );
}

export default MessageBox;
