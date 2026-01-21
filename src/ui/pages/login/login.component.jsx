import React, { useContext, useState } from 'react'
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import style from './login.module.css';
import axios from 'axios';
import { BASE_API_URL } from '../../data';
import { DpStore } from '../../store/userStore';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import IconButton from '@mui/material/IconButton';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 420,
    padding: theme.spacing(4),
    textAlign: 'center',
    borderRadius: 10,
    boxShadow: '0px 8px 25px rgba(0,0,0,0.15)'
}));

function Login({ setUser }) {
    const [openShutdown, setOpenShutdown] = useState(false);
    const [hostDp, setHostDp] = useContext(DpStore);
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    const [userIdProps, setUserIdProps] = useState({});
    const [passwordProps, setPasswordProps] = useState({});

    const handleOnSubmit = () => {
        const payload = { staffEmail: userid, password };

        axios.post(BASE_API_URL + 'api/authenticate', payload)
            .then((response) => {
                if (!response.data.status) {
                    if (response.data.issueWith === 'email') {
                        setUserIdProps({ error: true, helperText: response.data.message });
                        setPasswordProps({});
                    } else {
                        setPasswordProps({ error: true, helperText: response.data.message });
                        setUserIdProps({});
                    }
                } else {
                    setUserIdProps({});
                    setPasswordProps({});
                    async function handleFunction() {
                        await window.electronStore.set("user", response.data.data);
                        setUser(response.data.data);
                        // try {
                        //     const res = await axios.get(`${BASE_API_URL}api/dp/${response.data.data._id}`);
                        //     console.log("res: ", res);
                        //     const profilePicture = res?.data?.data?.profilePicture;
                        //     if (profilePicture) {
                        //         setHostDp(profilePicture);
                        //         await window.electronStore.set("dp", profilePicture);
                        //     }
                        // } catch (err) {
                        //     setHostDp(null)
                        //     await window.electronStore.set("dp", null);
                        // }
                    }
                    handleFunction();
                }
            })
    };

    return (
        <div className={style.wrapper}>

            <div className={style.cardWrapper}>
                <DemoPaper>
                    <h1 className={style.header}>Travelogy</h1>
                    <h2 className={style.subHeader}>Employee Login</h2>
                    <p className={style.description}>Enter your credentials to log in</p>

                    <Stack spacing={2}>
                        <TextField
                            {...userIdProps}
                            label="Email ID"
                            fullWidth
                            required
                            value={userid}
                            onChange={(e) => setUserid(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleOnSubmit()}
                        />

                        <TextField
                            {...passwordProps}
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleOnSubmit()}
                        />

                        <Button
                            variant="contained"
                            onClick={handleOnSubmit}
                            sx={{
                                backgroundColor: '#44a33b',
                                padding: '10px',
                                fontWeight: '600',
                                ":hover": {
                                    backgroundColor: '#3b8f33'
                                }
                            }}
                        >
                            LOGIN
                        </Button>
                    </Stack>
                </DemoPaper>
            </div>
            {/* Bottom Left Shutdown Button */}
            <div
                style={{
                    position: "fixed",
                    bottom: 24,
                    left: 24,
                    zIndex: 1000
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<PowerSettingsNewIcon />}
                    onClick={() => setOpenShutdown(true)}
                    sx={{
                        background: "linear-gradient(135deg, #2e7d32, #43a047)",
                        borderRadius: "30px",
                        padding: "10px 20px",
                        fontWeight: 600,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                        ":hover": {
                            background: "linear-gradient(135deg, #256b2b, #388e3c)"
                        }
                    }}
                >
                    Shut Down PC
                </Button>
            </div>
            <Dialog
                open={openShutdown}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpenShutdown(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        background: "linear-gradient(180deg, #e8f5e9, #c8e6c9)"
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontWeight: 700,
                        color: "#1b5e20"
                    }}
                >
                    <WarningAmberRoundedIcon color="warning" />
                    Confirm Shutdown
                </DialogTitle>

                <DialogContent>
                    <p
                        style={{
                            marginTop: 10,
                            fontSize: "15px",
                            color: "#2e7d32"
                        }}
                    >
                        Are you sure you want to shut down this computer?
                        <br />
                        <strong>All running work will be closed.</strong>
                    </p>
                </DialogContent>

                <DialogActions sx={{ padding: 2 }}>
                    <Button
                        onClick={() => setOpenShutdown(false)}
                        variant="outlined"
                        sx={{
                            borderRadius: 20,
                            color: "#2e7d32",
                            borderColor: "#2e7d32"
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() => {
                            setOpenShutdown(false);
                            window.electron.ipcRenderer.send("shutdown-pc");
                        }}
                        variant="contained"
                        startIcon={<PowerSettingsNewIcon />}
                        sx={{
                            borderRadius: 20,
                            background: "linear-gradient(135deg, #c62828, #d32f2f)",
                            ":hover": {
                                background: "linear-gradient(135deg, #b71c1c, #c62828)"
                            }
                        }}
                    >
                        Shut Down
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Login;
