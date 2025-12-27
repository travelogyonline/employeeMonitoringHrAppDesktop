import { useState, useEffect, useRef, useContext } from "react";
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
import { LanguageStore, ThemeStore } from "../../../../../store/userStore";
import translate from '../../../../../language/translate';

function MessageBox({ activeUser, allUser }) {
  const [theme] = useContext(ThemeStore);
  const [language] = useContext(LanguageStore);
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
            color: theme.medium
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 56, mb: 1 }} />
          <Typography fontWeight={700}>
            {translate(language,"noConversationSelected")}
          </Typography>
          <Typography variant="body2">
            {translate(language,"createAConversation")}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: theme.dark, color: theme.text }}>
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
            <Paper sx={{ p: 1.5, maxWidth: "60%", bgcolor: theme.light, color: theme.medium }}>
              <Typography>{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Paper sx={{ mt: 2, p: 1, display: "flex", bgcolor: theme.light }}>
        <TextField
          fullWidth
          placeholder={translate(language,"typeYourMessage")}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          sx={{
            "& .MuiInputBase-input": {
              color: theme.medium,
            }
          }}
        />
        <IconButton onClick={sendMessage} sx={{color: theme.medium}}>
          <SendIcon />
        </IconButton>
      </Paper>
    </>
  );
}

export default MessageBox;
