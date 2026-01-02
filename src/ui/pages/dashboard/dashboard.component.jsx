import style from './dashboard.module.css';
import logo from '../../assets/logo.png';
import { useContext, useState, useEffect } from 'react';
import LandingPage from './pages/landing/landingPage.component.jsx';
import Profile from './pages/profile/profile.jsx';
import { BASE_API_URL } from '../../data.jsx';
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BugReportIcon from "@mui/icons-material/BugReport";
import LogoutIcon from '@mui/icons-material/Logout';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import axios from 'axios';
import Friends from './pages/friends/friends.component.jsx';
import PeopleIcon from '@mui/icons-material/People';
import { LanguageStore, ThemeStore, UserStore } from '../../store/userStore.jsx';
import AppBar from './components/AppBar/appBar.jsx';
import ChatRoom from './pages/ChatRoom/chatRoom.jsx';
import ForumIcon from "@mui/icons-material/Forum";
import SettingsIcon from '@mui/icons-material/Settings';
import Settings from './pages/Settings/settings.jsx';
import translate from '../../language/translate.jsx';
import TicketDashboard from './pages/TicketDashboard/ticketDashboard.jsx';

function Dashboard({ setUser }) {
    const [language] = useContext(LanguageStore);
    const [hostUser, setHostUser] = useContext(UserStore);
    const [theme, setTheme] = useContext(ThemeStore)
    const [page, setPage] = useState("dashboard");
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

        } catch (err) { }
    };
    const handleLogout = async () => {
        if (hostUser.login !== 'false') {
            const config = {
                method: 'patch',
                maxBodyLength: Infinity,
                url: `${BASE_API_URL}api/login/out/${hostUser._id}`,
            };

            await axios.request(config)
        }
        async function handleResponse() {
            await window.electronStore.delete("user");
            await window.electronAPI.status("false");
            setUser(false);
        }
        handleResponse();
    }

    return (
        <div className={style.container} style={{ backgroundColor: theme.light }}>
            <div className={style.innerContainer}>
                <div className={style.sidebar} style={{ backgroundColor: theme.medium }}>
                    <div className={style.logoContainer} style={{ backgroundColor: theme.dark }}>
                        <img src={logo} alt="Logo" className={style.logo} />
                    </div>
                    <List sx={{ width: "100%", padding: 0 }}>
                        <ListItemButton onClick={() => setPage('dashboard')} >
                            <ListItemIcon>
                                <DashboardIcon sx={{ color: theme.text }} />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: theme.text }}
                                primary={translate(language, "dashboard")}
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton onClick={() => setPage('profile')}>
                            <ListItemIcon>
                                <AccountCircleIcon sx={{ color: theme.text }} />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: theme.text }}
                                primary={translate(language, "profile")}
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton onClick={() => setPage('friend')}>
                            <ListItemIcon>
                                <PeopleIcon sx={{ color: theme.text }} />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: theme.text }}
                                primary={translate(language, "friends")}
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton onClick={() => setPage("chatRoom")}>
                            <ListItemIcon>
                                <ForumIcon sx={{ color: theme.text }} />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: theme.text }}
                                primary={translate(language, "chatRoom")}
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton onClick={() => setPage("settings")}>
                            <ListItemIcon>
                                <SettingsIcon sx={{ color: theme.text }} />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: theme.text }}
                                primary={translate(language, "settings")}
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton onClick={() => setPage("report-bug")}>
                            <ListItemIcon>
                                <BugReportIcon sx={{ color: theme.text }} />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: theme.text }}
                                primary={translate(language, "reportBug")}
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon sx={{ color: theme.text }} />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: theme.text }}
                                primary={translate(language, "logout")}
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>

                    </List>
                </div>
                <div className={style.content}>
                    <AppBar setFriend={(v) => setFriend(v)} setPage={setPage} />
                    {page === 'dashboard' && <LandingPage />}
                    {page === 'profile' && <Profile />}
                    {page === 'chatRoom' && <ChatRoom />}
                    {page === 'friend' && <Friends friend={friend} user={hostUser} />}
                    {page === 'settings' && <Settings />}
                    {page === 'report-bug' && <TicketDashboard />}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
