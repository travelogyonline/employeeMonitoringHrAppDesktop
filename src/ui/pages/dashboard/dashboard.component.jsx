import style from './dashboard.module.css';
import logo from '../../assets/logo.png';
import { useContext, useState, useEffect } from 'react';
import LandingPage from './pages/landing/landingPage.component.jsx';
import Profile from './pages/profile/profile.jsx';
import { BASE_API_URL } from '../../data.jsx';
import {
    Typography,
    Modal,
    Box,
    Button,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import axios from 'axios';
import Friends from './pages/friends/friends.component.jsx';
import PeopleIcon from '@mui/icons-material/People';
import { UserStore } from '../../store/userStore.jsx';
import AppBar from './components/AppBar/appBar.jsx';
import ChatRoom from './pages/ChatRoom/chatRoom.jsx';
import ForumIcon from "@mui/icons-material/Forum";

const modelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
};


function Dashboard({ setUser }) {
    const [hostUser, setHostUser] = useContext(UserStore);
    const [page, setPage] = useState("dashboard");
    const [modelOpen, setmodelOpen] = useState(false);
    const [friend, setFriend] = useState(null)
    const [image, setImage] = useState(null);


    const handleCapture = async () => {
        if (page === 'chatRoom') return;
        const img = await window.electronAPI.captureScreen();
        setImage(img);
        uploadScreenshot(img);
    };
    // Sending the app, that the laptop is awake
    useEffect(() => {
        window.electronAPI.sendMessage(true);
    }, []);
    useEffect(() => {
        handleCapture();

        const interval = setInterval(() => {
            handleCapture();
        }, 10 * 60 * 1000);

        return () => clearInterval(interval);
    }, [page]);

    const uploadScreenshot = async (img) => {
        try {
            if (!img) return;

            const response = await fetch(img);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append("image", blob, "screenshot.png");

            const upload = await fetch(BASE_API_URL + "api/screenshot/" + hostUser._id, {
                method: "POST",
                body: formData
            });

            await upload.json();

        } catch (err) {
            console.error(err);
        }
    };
    const handleModelClose = () => setmodelOpen(false);
    const handleLogout = async () => {
        if (hostUser.login !== 'false') {
            const config = {
                method: 'patch',
                maxBodyLength: Infinity,
                url: `${BASE_API_URL}api/login/out/${hostUser._id}`,
            };

            await axios.request(config)
                .then((res) => {
                })
                .catch((error) => {
                    // console.log(error);
                });
        }
        async function handleResponse() {
            await window.electronStore.delete("user");
            setUser(false);
        }
        handleResponse();
    }

    return (
        <div className={style.container}>
            <div className={style.innerContainer}>
                <div className={style.sidebar}>
                    <div className={style.logoContainer}>
                        <img src={logo} alt="Logo" className={style.logo} />
                    </div>
                    <List sx={{ width: "100%", padding: 0 }}>
                        <ListItemButton onClick={() => setPage('dashboard')}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: '#5d5949' }}
                                primary="Dashboard"
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton onClick={() => setPage('profile')}>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: '#5d5949' }}
                                primary="Profile"
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton onClick={() => setPage('friend')}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: '#5d5949' }}
                                primary="Friends"
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton onClick={() => setPage("chatRoom")}>
                            <ListItemIcon>
                                <ForumIcon />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: "#5d5949" }}
                                primary="Chat Room"
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: '#5d5949' }}
                                primary="Logout"
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>

                    </List>
                </div>
                <div className={style.content}>
                    <AppBar setFriend={setFriend} setPage={setPage} />
                    {page === 'dashboard' && <LandingPage />}
                    {page === 'profile' && <Profile />}
                    {page === 'chatRoom' && <ChatRoom />}
                    {page === 'friend' && <Friends friend={friend} user={hostUser} />}
                </div>
            </div>
            <Modal
                open={modelOpen}
                onClose={handleModelClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modelStyle}>
                    <Typography variant="h4" gutterBottom>{hostUser.staffName}</Typography>
                    <Typography className={style.role} variant="subtitle1" gutterBottom>{hostUser.role}</Typography>

                    <Typography variant="subtitle2" gutterBottom>Email</Typography>
                    <Typography variant="body1" gutterBottom>{hostUser.staffEmail}</Typography>

                    <Typography variant="subtitle2" gutterBottom>Phone</Typography>
                    <Typography variant="body1" gutterBottom>{hostUser.staffPhone}</Typography>

                    {/* ➤ NEW BUTTON AT BOTTOM */}
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Button variant="contained" color="primary" onClick={() => setPasswordModal(true)}>
                            Change Password
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default Dashboard;
