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
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import axios from 'axios';
import Friends from './pages/friends/friends.component.jsx';
import PeopleIcon from '@mui/icons-material/People';
import { ThemeStore, UserStore } from '../../store/userStore.jsx';
import AppBar from './components/AppBar/appBar.jsx';
import ChatRoom from './pages/ChatRoom/chatRoom.jsx';
import ForumIcon from "@mui/icons-material/Forum";
import MyTheme from './pages/Theme/MyTheme.jsx';

function Dashboard({ setUser }) {
    const [hostUser, setHostUser] = useContext(UserStore);
    const [theme,setTheme] = useContext(ThemeStore)
    const [page, setPage] = useState("dashboard");
    const [friend, setFriend] = useState(null)
    const [image, setImage] = useState(null);

    console.log(theme)

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
        <div className={style.container} style={{backgroundColor: theme.light}}>
            <div className={style.innerContainer}>
                <div className={style.sidebar} style={{ backgroundColor: theme.medium }}>
                    <div className={style.logoContainer} style={{backgroundColor: theme.dark}}>
                        <img src={logo} alt="Logo" className={style.logo} />
                    </div>
                    <List sx={{ width: "100%", padding: 0 }}>
                        <ListItemButton onClick={() => setPage('dashboard')}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: theme.text }}
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
                                sx={{ color: theme.text }}
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
                                sx={{ color: theme.text }}
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
                                sx={{ color: theme.text }}
                                primary="Chat Room"
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>


                        <Divider />
                        <ListItemButton onClick={() => setPage("myThemes")}>
                            <ListItemIcon>
                                <TableChartIcon />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: theme.text }}
                                primary="My Themes"
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>

                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ color: theme.text }}
                                primary="Logout"
                                primaryTypographyProps={{ variant: "h6" }}
                            />
                        </ListItemButton>

                    </List>
                </div>
                <div className={style.content}>
                    <AppBar setFriend={(v)=>setFriend(v)} setPage={setPage} />
                    {page === 'dashboard' && <LandingPage />}
                    {page === 'profile' && <Profile />}
                    {page === 'chatRoom' && <ChatRoom />}
                    {page === 'friend' && <Friends friend={friend} user={hostUser} />}
                    {page === 'myThemes' && <MyTheme />}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
