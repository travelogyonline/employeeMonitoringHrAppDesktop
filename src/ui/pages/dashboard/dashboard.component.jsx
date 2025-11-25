import style from './dashboard.module.css'
import { useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import LoginTab from './loginTab/loginTab.component.jsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BASE_API_URL } from '../../data.jsx';

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
    const [modelOpen, setmodelOpen] = useState(false);
    const handleModelOpen = () => setmodelOpen(true);
    const handleModelClose = () => setmodelOpen(false);
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
        <div>
            <div className={style.header}>
                <div>
                    <Typography variant="h4" gutterBottom className={style.headerText}>
                        Travelogy
                    </Typography>
                </div>
                <div>
                    <Typography variant="h5" gutterBottom className={style.headerText} onClick={handleModelOpen} sx={{ cursor: 'pointer' }}>
                        {user.name}
                    </Typography>
                </div>
                <Button variant="contained" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
            <div>
                <div>
                    <LoginTab isAuthenticated={isAuthenticated} user={user} />
                </div>
            </div>
            <Modal
                open={modelOpen}
                onClose={handleModelClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modelStyle}>
                    <Typography variant="h4" gutterBottom>{user.name}</Typography>
                    <Typography className={style.role} variant="subtitle1" gutterBottom>{user.role}</Typography>
                    <Typography variant="subtitle2" gutterBottom>Email</Typography>
                    <Typography variant="body1" gutterBottom>{user.email}</Typography>

                    <Typography variant="subtitle2" gutterBottom>Phone</Typography>
                    <Typography variant="body1" gutterBottom>{user.phone}</Typography>

                    <Typography variant="subtitle2" gutterBottom>Age</Typography>
                    <Typography variant="body1" gutterBottom>{user.age}</Typography>
                </Box>
            </Modal>
        </div>
    );
}

export default Dashboard;
