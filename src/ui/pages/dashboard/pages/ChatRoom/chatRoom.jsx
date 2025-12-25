import { useState, useContext } from "react";
import {
  Box,
  Avatar,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from '@mui/icons-material/Add';
import { useChatList } from "./hooks/useChatList";
import { useAlluser } from "./hooks/useAllUser";
import { ThemeStore, UserStore } from "../../../../store/userStore";
import { BASE_API_URL } from "../../../../data";
import axios from "axios";
import MessageBox from "./components/messageBox";
import getDp from "./functions/getDp";
import lightenHex from './functions/colourLightner';

export default function ChatBox({setPage}) {
  const [hostUser, setHostUser] = useContext(UserStore);
  const [theme] = useContext(ThemeStore)
  const [chatlist, loadingChatlist, refreshChatlist] = useChatList(hostUser._id)
  const [allUser, loadingAllUser] = useAlluser();

  const [activeUser, setActiveUser] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const createChatRoom = (value) => {
    let config = {
      method: 'post',
      url: `${BASE_API_URL}api/chats`,
      data: {
        user1: hostUser._id,
        user1name: hostUser.staffName,
        user2: value._id,
        user2name: value.staffName,
      }
    };

    axios.request(config)
      .then((response) => {
        refreshChatlist();
      })
  }

  return (
    <Box
      sx={{
        height: "90vh",
        bgColor: lightenHex(theme.light, 20),
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
          backgroundColor: theme.medium,
        }}
      >
        {/* ================= LEFT SIDEBAR ================= */}
        <Box
          width={280}
          p={2}
          display="flex"
          flexDirection="column"
          sx={{
            bgcolor: theme.medium
          }}
        >
          <Paper
            sx={{
              mb: 2,
              p: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            {!loadingChatlist && (
              <>
                <SearchIcon fontSize="small" sx={{ ml: 1, color: theme.dark }} />

                <Autocomplete
                  options={chatlist}
                  getOptionLabel={(option) => option?.clientName || ""}
                  onChange={(e, value) => {
                    if (value) {
                      setActiveUser(value)
                    }
                  }}
                  sx={{ ml: 1, flex: 1 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search Friend"
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                      }}
                    />
                  )}
                  /* Dropdown container */
                  PaperComponent={(props) => (
                    <Paper
                      {...props}
                      sx={{
                        mt: 1,
                        borderRadius: 3,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                        overflow: "hidden",
                      }}
                    />
                  )}
                  /* Option styling */
                  renderOption={(props, option, { selected }) => (
                    <li
                      {...props}
                      style={{
                        padding: "10px 16px",
                        fontWeight: selected ? 600 : 500,
                        // backgroundColor: theme.light,
                        backgroundColor: selected ? theme.dark : theme.light,
                        color: selected ? theme.text : theme.dark,
                      }}
                    >
                      {option.clientName}
                    </li>
                  )}
                  /* Listbox (scroll area) */
                  ListboxProps={{
                    sx: {
                      maxHeight: 280,
                      p: 0,
                      "&::-webkit-scrollbar": { width: "8px" },
                      "&::-webkit-scrollbar-track": { background: "transparent" },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: theme.medium,
                        borderRadius: "8px",
                      },
                      "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: theme.dark,
                      },
                    },
                  }}
                />

                {/* ================= ADD BUTTON ================= */}
                <IconButton
                  size="small"
                  onClick={() => setOpen(true)}
                  sx={{
                    ml: 1,
                    bgcolor: theme.medium,
                    color: "white",
                    "&:hover": {
                      bgcolor: theme.dark,
                    },
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </>
            )}
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
              {!loadingChatlist && chatlist.length > 0 && chatlist.map((friend, index) => {
                const isActive = activeUser.clientId === friend.clientId;
                return (
                  <ListItem
                    key={index}
                    onClick={() => setActiveUser(friend)}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                      bgcolor: isActive ? theme.dark : theme.light,
                      color: isActive ? theme.light : theme.dark,
                      transition: "0.2s",
                      "&:hover": {
                        bgcolor: theme.dark,
                        color: theme.light
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{ bgcolor: "#2F5BFF" }}
                        src={getDp(friend.clientId, allUser) || undefined}
                      />
                    </ListItemAvatar>
                    <ListItemText primary={friend.clientName} />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>

        {/* ================= RIGHT CHAT AREA ================= */}
        <Box flex={1} p={2} display="flex" flexDirection="column" sx={{backgroundColor: lightenHex(theme.medium,40)}}>

          <MessageBox activeUser={activeUser} allUser={allUser} setPage={setPage}/>

        </Box>
      </Paper>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
          },
        }}
      >
        <DialogTitle fontWeight={700}>
          Start New Chat
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Autocomplete
              options={allUser}
              getOptionLabel={(option) => option?.staffName || ""}
              onChange={(e, value) => setSelectedUser(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select User"
                  placeholder="Search by name"
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option._id === value._id
              }
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={!selectedUser}
            onClick={() => {
              createChatRoom(selectedUser);
              setOpen(false);
            }}
          >
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
