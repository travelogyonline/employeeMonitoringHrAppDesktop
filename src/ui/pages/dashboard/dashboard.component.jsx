import style from './dashboard.module.css'
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BorderAllRounded } from '@mui/icons-material';

const modelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
};


function Dashboard({ isAuthenticated, user }) {
    const [modelOpen, setmodelOpen] = useState(false);
    const handleModelOpen = () => setmodelOpen(true);
    const handleModelClose = () => setmodelOpen(false);
    return (
        <div>
            <div className={style.header}>
                <div>
                    <Typography variant="h4" gutterBottom className={style.headerText}>
                        Travelogy
                    </Typography>
                </div>
                <div>
                    <Typography variant="h5" gutterBottom className={style.headerText} onClick={handleModelOpen} sx={{cursor: 'pointer'}}>
                        {user.name}
                    </Typography>
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
