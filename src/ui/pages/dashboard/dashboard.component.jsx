import style from './dashboard.module.css';
import logo from '../../assets/logo.png';
import { useState } from 'react';
import LoginTab from './pages/loginTab/loginTab.component.jsx';
import ChangePasswordModal from './ChangePasswordModal.jsx';
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


function Dashboard({ isAuthenticated, user }) {
    const [page, setPage] = useState("dashboard");
    const [passwordModal, setPasswordModal] = useState(false);
    const [modelOpen, setmodelOpen] = useState(false);
    const handleModelOpen = () => setmodelOpen(true);
    const handleModelClose = () => setmodelOpen(false);
    console.log("user: ", user)
    const handleLogout = async () => {
        if (user.login !== 'false') {
            const config = {
                method: 'patch',
                maxBodyLength: Infinity,
                url: `${BASE_API_URL}api/login/out/${user._id}`,
            };

            await axios.request(config)
                .then((res) => {
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        async function handleResponse() {
            await window.electronStore.delete("user");
            isAuthenticated(false);
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
                    {page === 'dashboard' && <LoginTab isAuthenticated={isAuthenticated} user={user} />}
                    {page === 'profile' && <Profile user={user} />}
                </div>
            </div>
            <Modal
                open={modelOpen}
                onClose={handleModelClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modelStyle}>
                    <Typography variant="h4" gutterBottom>{user.staffName}</Typography>
                    <Typography className={style.role} variant="subtitle1" gutterBottom>{user.role}</Typography>

                    <Typography variant="subtitle2" gutterBottom>Email</Typography>
                    <Typography variant="body1" gutterBottom>{user.staffEmail}</Typography>

                    <Typography variant="subtitle2" gutterBottom>Phone</Typography>
                    <Typography variant="body1" gutterBottom>{user.staffPhone}</Typography>

                    {/* ➤ NEW BUTTON AT BOTTOM */}
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Button variant="contained" color="primary" onClick={() => setPasswordModal(true)}>
                            Change Password
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* ➤ PASSWORD CHANGE POPUP */}
            <ChangePasswordModal
                open={passwordModal}
                handleClose={() => setPasswordModal(false)}
                user={user}
            />

        </div>
    );
}

export default Dashboard;
