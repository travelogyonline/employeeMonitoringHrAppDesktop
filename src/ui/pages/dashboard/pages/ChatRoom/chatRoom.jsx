// import { useState } from "react";
// import ChatList from "./components/chatList";

// function ChatRoom() {
//   const [activeRoom, setActiveRoom] = useState([]);
//   return (
//     <div>
//       <ChatList activeRoom={activeRoom} setActiveRoom={(v)=>setActiveRoom(v)}/>
//     </div>
//   )
// }

// export default ChatRoom;

import React, { useState } from "react";
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
  Divider,
  Badge,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

// ---------------- DUMMY DATA ----------------
const users = [
  {
    id: 1,
    name: "Mavis Barry",
    avatar: "https://i.pravatar.cc/150?img=1",
    online: true,
    lastMessage: "Yes, I did and sent...",
    time: "12:30",
  },
  {
    id: 2,
    name: "Gita Zahara",
    avatar: "https://i.pravatar.cc/150?img=2",
    online: false,
    lastMessage: "Ok, thanks",
    time: "12:30",
  },
  {
    id: 3,
    name: "Mehran Malekpour",
    avatar: "https://i.pravatar.cc/150?img=3",
    online: false,
    lastMessage: "Before the class",
    time: "12:30",
  },
];

const messages = [
  {
    id: 1,
    sender: "them",
    text: "Hello, how are you? Shall we have a meeting?",
    time: "09:12",
  },
  {
    id: 2,
    sender: "me",
    text: "Of course! I will come to a meeting with you in 15 minutes",
    time: "09:20",
  },
  {
    id: 3,
    sender: "them",
    text: "Please send photos too",
    time: "09:30",
  },
];

// ---------------- COMPONENT ----------------
export default function ChatRoom() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [chatMessages, setChatMessages] = useState(messages);
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    setChatMessages([
      ...chatMessages,
      { id: Date.now(), sender: "me", text, time: "Now" },
    ]);
    setText("");
  };

  return (
    <Box display="flex" height="100vh" bgcolor="#f5f7fb">
      {/* LEFT PANEL */}
      <Box width={320} bgcolor="#fff" borderRight="1px solid #eee">
        <Box p={2}>
          <TextField fullWidth size="small" placeholder="Search" />
        </Box>
        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              button
              selected={selectedUser.id === user.id}
              onClick={() => setSelectedUser(user)}
            >
              <ListItemAvatar>
                <Badge
                  color="success"
                  variant="dot"
                  overlap="circular"
                  invisible={!user.online}
                >
                  <Avatar src={user.avatar} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={user.lastMessage}
              />
              <Typography variant="caption">{user.time}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* RIGHT PANEL */}
      <Box flex={1} display="flex" flexDirection="column">
        {/* HEADER */}
        <Box
          display="flex"
          alignItems="center"
          p={2}
          bgcolor="#fff"
          borderBottom="1px solid #eee"
        >
          <Avatar src={selectedUser.avatar} />
          <Box ml={2}>
            <Typography fontWeight={600}>{selectedUser.name}</Typography>
            <Typography variant="caption" color="green">
              {selectedUser.online ? "Online" : "Offline"}
            </Typography>
          </Box>
        </Box>

        {/* MESSAGES */}
        <Box flex={1} p={2} overflow="auto">
          {chatMessages.map((msg) => (
            <Box
              key={msg.id}
              display="flex"
              justifyContent={msg.sender === "me" ? "flex-end" : "flex-start"}
              mb={2}
            >
              <Box
                maxWidth="60%"
                p={1.5}
                borderRadius={2}
                bgcolor={msg.sender === "me" ? "#6c63ff" : "#fff"}
                color={msg.sender === "me" ? "#fff" : "#000"}
                boxShadow={1}
              >
                <Typography variant="body2">{msg.text}</Typography>
                <Typography variant="caption" display="block" align="right">
                  {msg.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* INPUT */}
        <Divider />
        <Box display="flex" p={2} bgcolor="#fff">
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
