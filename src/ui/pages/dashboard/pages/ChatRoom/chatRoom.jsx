import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";

/* ---------------- DUMMY DATA ---------------- */
const friends = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
}));

const initialMessages = [
  { id: 1, sender: "them", text: "Hey!" },
  { id: 2, sender: "me", text: "Hello!" },
  { id: 3, sender: "them", text: "How are you doing!?" },
  { id: 4, sender: "me", text: "I am doing good! What about you?" },
  { id: 5, sender: "them", text: "All Good..." },
];

export default function ChatBox() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [activeUser, setActiveUser] = useState(friends[0]);

  const bottomRef = useRef(null);

  /* Auto-scroll on new message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "me", text: input },
    ]);
    setInput("");
  };

  return (
    <Box
      sx={{
        height: "90vh",
        backgroundColor: "#FFF2C2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "95%",
          height: "90%",
          borderRadius: 4,
          display: "flex",
          overflow: "hidden",
          backgroundColor: "#FFF6D9",
        }}
      >
        {/* ================= LEFT SIDEBAR ================= */}
        <Box
          width={280}
          p={2}
          bgcolor="#FBE7A1"
          display="flex"
          flexDirection="column"
        >
          {/* Search */}
          <Paper
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRadius: 2,
              bgcolor: "#FFFFFF",
            }}
          >
            <SearchIcon fontSize="small" />
            <TextField
              placeholder="Search Friend"
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ ml: 1, flex: 1 }}
            />
          </Paper>

          {/* Friends List */}
          <Box
            flex={1}
            sx={{
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <List>
              {friends.map((friend) => {
                const isActive = activeUser.id === friend.id;

                return (
                  <ListItem
                    key={friend.id}
                    onClick={() => setActiveUser(friend)}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                      bgcolor: isActive ? "#FFFDF4" : "#FFF6D9",
                      border: isActive
                        ? "2px solid #2F5BFF"
                        : "1px solid #F0E2A0",
                      transition: "0.2s",
                      "&:hover": {
                        bgcolor: "#FFFDF4",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#2F5BFF" }}>
                        {friend.name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={friend.name} />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>

        {/* ================= RIGHT CHAT AREA ================= */}
        <Box flex={1} p={2} display="flex" flexDirection="column">
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
              <Avatar sx={{ bgcolor: "#2F5BFF", mr: 2 }}>
                {activeUser.name[0]}
              </Avatar>
              <Typography fontWeight={600}>
                {activeUser.name}
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
                  msg.sender === "me" ? "flex-end" : "flex-start"
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
                      msg.sender === "me" ? "#FFFFFF" : "#FFF0C2",
                    wordBreak: "break-word",
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
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
        </Box>
      </Paper>
    </Box>
  );
}
