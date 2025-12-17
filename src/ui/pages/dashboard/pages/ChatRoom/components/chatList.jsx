import { useContext } from "react";
import { UserStore } from "../../../../../store/userStore";
import { useChatList } from "../hooks/useChatList";

import { CircularProgress, Box, Backdrop, Typography, Avatar } from "@mui/material";


function ChatList({ activeRoom, setActiveRoom }) {

    const [hostUser, setHostUser] = useContext(UserStore);
    const [chats, loading] = useChatList(hostUser._id);
    console.log("chats: ", chats);
    console.log("loading: ", loading);
    return loading ? (
        <Backdrop
            open
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    ) : (<Box
        sx={{
            height: "100%",
            overflowY: "auto",
            borderRight: "1px solid #e0e0e0",
        }}
    >
        {chats.length === 0 && (
            <Typography sx={{ p: 2, color: "text.secondary" }}>
                No chats yet
            </Typography>
        )}

        {chats.map((chat) => {
            const otherUser =
                chat.user1._id === hostUser._id
                    ? chat.user2
                    : chat.user1;

            const isActive = activeRoom === chat.roomID;

            return (
                <Box
                    key={chat.roomID}
                    onClick={() => setActiveRoom(chat.roomID)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 2,
                        py: 1.2,
                        cursor: "pointer",
                        backgroundColor: isActive ? "#e3f2fd" : "transparent",
                        "&:hover": {
                            backgroundColor: isActive ? "#e3f2fd" : "#f5f5f5",
                        },
                    }}
                >
                    {/* Avatar */}
                    <Avatar
                        src={otherUser?.avatar || ""}
                        alt={otherUser?.staffName}
                        sx={{ width: 44, height: 44 }}
                    >
                        {otherUser?.staffName?.[0]}
                    </Avatar>

                    {/* Name & Last Message */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            fontWeight={600}
                            noWrap
                        >
                            {otherUser.staffName}
                        </Typography>
                    </Box>

                </Box>
            );
        })}
    </Box>);
}

export default ChatList