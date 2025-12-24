import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Divider,
    Paper,
    Modal,
    Fade,
    Backdrop
} from "@mui/material";
import axios from "axios";
import { BASE_API_URL } from "../../../../data";
import MyThoughts from "./components/MyThoughts";
import ProfileAvatar from "./components/profilePicture";
import Album from "./components/album";
import AlbumImageUploader from "./components/AlbumImageUploader";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import CakeIcon from "@mui/icons-material/Cake";
import TimelineIcon from "@mui/icons-material/Timeline";
import formatBirthday from "./functions/formatBirthday";
import getExperience from "./functions/getExperience";
import BackupIcon from '@mui/icons-material/Backup';
import FriendThought from "./components/FriendThought";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
};


export default function Friends({ friend, user }) {

    if (!friend) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                    backgroundColor: "#FFF7D6",
                    height: "100%",
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 4,
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                    }}
                >
                    <PersonSearchIcon
                        sx={{ fontSize: 56, color: "#FFB300", mb: 1.5 }}
                    />
                    <Typography variant="h6" fontWeight={700}>
                        No Friend Selected
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Search and select a friend to see their thoughts and albums.
                    </Typography>
                </Paper>
            </Box>
        );
    }

    const [imageRefresher, setImageRefresh] = useState(null);
    const [open, setOpen] = useState(false);
    const [client, setClient] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function refresh() {
        axios.get(`${BASE_API_URL}api/user/${friend._id}`)
            .then((response) => {
                axios.get(`${BASE_API_URL}api/dp/${friend._id}`)
                    .then((res) => {
                        let newClient = { ...response.data.data };
                        if (res.data.data[0]) {
                            newClient.profilePicture =
                                res.data.data[0].profilePicture;
                        }
                        setClient(newClient);
                    });
            })
            .catch(() => { });
    }

    useEffect(() => {
        refresh();
    }, [friend]);

    return (
        <Box
            sx={{
                display: "flex",
                gap: 3,
                p: 2,
                backgroundColor: "#FFF7D6",
            }}
        >
            {/* LEFT — PROFILE */}
            <Paper
                elevation={0}
                sx={{
                    width: "32%",
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#FFF1B8",
                }}
            >
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <ProfileAvatar client={client} user={user} />

                    <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                        {client?.staffName}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {client?.designation || "Employee"}
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        backgroundColor: "#FFE082",
                        mb: 3,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.2 }}>
                        <PhoneIcon sx={{ fontSize: 18, mr: 1, color: "#5D4037" }} />
                        <Typography variant="body2">
                            {client?.staffPhone}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.2 }}>
                        <EmailIcon sx={{ fontSize: 18, mr: 1, color: "#5D4037" }} />
                        <Typography variant="body2">
                            {client?.staffEmail}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.2 }}>
                        <WorkIcon sx={{ fontSize: 18, mr: 1, color: "#5D4037" }} />
                        <Typography variant="body2">
                            {client?.role}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.2 }}>
                        <CakeIcon sx={{ fontSize: 18, mr: 1, color: "#6A1B9A" }} />
                        <Typography variant="body2">
                            Birthday: {formatBirthday(client?.dob)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TimelineIcon sx={{ fontSize: 18, mr: 1, color: "#2E7D32" }} />
                        <Typography variant="body2">
                            Experience: {getExperience(client?.doj)}
                        </Typography>
                    </Box>
                </Paper>



                {client?.myThoughts && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            pb: 0,
                            borderRadius: 3,
                            backgroundColor: "#FFE082",
                            textAlign: "center",
                        }}
                    >
                        {friend._id!==user._id? <FriendThought friend={friend} /> : <MyThoughts user={friend} updateUser={() => refresh()} />}
                    </Paper>
                )}
            </Paper>

            {/* RIGHT — ALBUM + ACTIONS */}
            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#FFF1B8",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Album
                    </Typography>

                    {friend._id === user._id && (
                        <Box
                            onClick={handleOpen}
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: "50%",
                                backgroundColor: "#FF9800",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 22,
                                cursor: "pointer",
                                '&:hover': { backgroundColor: "#e68900" } // Subtle hover effect
                            }}
                        >
                            <BackupIcon />
                        </Box>
                    )}
                </Box>

                <Album
                    friend={client}
                    user={user}
                    imageRefresher={imageRefresher}
                />
            </Paper>
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: { timeout: 500 },
                }}
            >
                <Fade in={open}>
                    <Box sx={modalStyle}>
                        <AlbumImageUploader
                            refresh={() => {
                                setImageRefresh(Math.floor(Math.random() * 1000));
                                handleClose(); 
                            }}
                        />
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
}
