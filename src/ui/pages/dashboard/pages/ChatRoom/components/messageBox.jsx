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
import getDp from "../functions/getDp";

function MessageBox({ activeUser, allUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  /* ---------------- INIT CHAT ---------------- */
  useEffect(() => {
    if (!activeUser?.roomID) return;

    socket.emit("join_room", activeUser.roomID);

    axios
      .get(`${BASE_API_URL}api/message/${activeUser.roomID}`)
      .then((res) => {
        setMessages(res.data || []);
      })
      .catch(console.error);

    return () => {
      socket.emit("leave_room", activeUser.roomID);
    };
  }, [activeUser]);

  /* ---------------- RECEIVE MESSAGE ---------------- */
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      window.electron.notify({
        title: 'Travel Chat',
        body: 'You have a new message!',
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = () => {
    if (!input.trim() || !activeUser) return;

    socket.emit("sendMessage", {
      roomID: activeUser.roomID,
      senderId: activeUser.hostId,
      senderName: activeUser.hostName,
      receiverId: activeUser.clientId,
      receiverName: activeUser.clientName,
      text: input,
    });

    setInput("");
  };

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 4,
            maxWidth: 360,
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 56, mb: 1 }} />
          <Typography fontWeight={700}>
            No Conversation Selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select or create a conversation to start chatting
          </Typography>
        </Paper>
      </Box>
    );
  }

  /* ---------------- CHAT UI ---------------- */
  return (
    <>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{ bgcolor: "#2F5BFF", mr: 2 }}
            src={getDp(activeUser.clientId, allUser) || undefined}
          />
          <Typography fontWeight={600}>
            {activeUser.clientName}
          </Typography>
        </Box>
      </Paper>

      {/* Messages */}
      <Box flex={1} sx={{ overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <Box
            key={i}
            display="flex"
            justifyContent={
              msg.senderId === activeUser.hostId
                ? "flex-end"
                : "flex-start"
            }
            mb={2}
          >
            <Paper sx={{ p: 1.5, maxWidth: "60%" }}>
              <Typography>{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Paper sx={{ mt: 2, p: 1, display: "flex" }}>
        <TextField
          fullWidth
          placeholder="Type your message…"
          variant="standard"
          InputProps={{ disableUnderline: true }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <IconButton onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </Paper>
    </>
  );
}

export default MessageBox;
