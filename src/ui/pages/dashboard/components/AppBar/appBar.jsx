import style from './appBar.module.css';
import UserProfileBar from '../component/userBar';
import EmployeeSearch from '../component/EmployeeSearch';
import { useContext, useState, useEffect } from 'react';
import { LanguageStore, ThemeStore, UserStore } from '../../../../store/userStore';
import axios from 'axios';
import Button from "@mui/material/Button";
import { BASE_API_URL } from '../../../../data';
import CurrentSession from '../component/currentSession';
import translate from '../../../../language/translate';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Typography } from "@mui/material";

export default function AppBar({ setFriend, setPage }) {
    const [hostUser, setHostUser] = useContext(UserStore);
    const [language] = useContext(LanguageStore);
    const [theme] = useContext(ThemeStore);
    const [breakMessage, setBreakMessage] = useState('Login ASAP');
    const [status, setStatus] = useState('');

    useEffect(() => {
        setStatus(hostUser.login);
    }, []);
    useEffect(() => {
        const cleanup = window.electronAPI.onUpdateData((data) => {
            setBreakMessage(data);
            setHostUser({
                ...hostUser,
                login: "false"
            })
            window.electronAPI.status("false");
            setStatus('false');
        });
        return cleanup;
    }, []);
    const handleWorkingStatus = async () => {
        const apiHelper = status !== 'false' ? "out" : "in";
        let config = {
            method: apiHelper === 'in' ? 'post' : 'patch',
            url: `${BASE_API_URL}api/login/${apiHelper}/${hostUser._id}`,
            headers: {}
        };

        await axios.request(config)
            .then((response) => {
                const config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `${BASE_API_URL}api/user/${response.data.data.userId}`,
                };

                axios.request(config)
                    .then((response) => {
                        async function handleFunction() {
                            await window.electronStore.set("user", response.data.data);
                            await window.electronAPI.status(response.data.data.login);
                            setHostUser(response.data.data);
                            setBreakMessage(false);
                            await window.electronAPI.onUpdateData((data) => {
                                setBreakMessage(data);
                            });
                            if(breakMessage===false) setBreakMessage("You are on break")
                        }
                        handleFunction();
                    })
                    .catch((error) => { }
                    );
                setStatus(status === 'false' ? 'true' : 'false')
            })
            .catch((error) => { }
            );
    }
    return (
        <div className={style.appBar}>
            <div
                onClick={() => { setFriend(hostUser); setPage('friend') }}
                style={{
                    color: theme.dark,
                    paddingLeft: '10px'
                }}
            >
                <UserProfileBar />
            </div>
            <div className={style.innerContainer}>
                {status !== 'false' ? <CurrentSession /> :
                    <Box
                        sx={{
                            mx: 1.5,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #ff1744, #d50000)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2,
                            boxShadow: "0 0 20px rgba(213,0,0,0.6)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            animation: "pulse 1.5s infinite",
                            "@keyframes pulse": {
                                "0%": { boxShadow: "0 0 10px rgba(213,0,0,0.4)" },
                                "50%": { boxShadow: "0 0 25px rgba(213,0,0,0.8)" },
                                "100%": { boxShadow: "0 0 10px rgba(213,0,0,0.4)" }
                            }
                        }}
                    >
                        <WarningAmberIcon sx={{ fontSize: 32 }} />

                        <Typography variant="subtitle1" fontWeight={600}>
                            {breakMessage}!
                        </Typography>
                    </Box>
                }
                <Button
                    variant="contained"
                    size="large"
                    className={style.button}
                    sx={{
                        mr: 4,
                        px: 4,
                        fontWeight: 600,
                        borderRadius: 2,
                        backgroundColor: status !== "false" ? 'red' : 'green'
                    }}
                    onClick={handleWorkingStatus}
                >
                    {status !== "false" ? translate(language, "goOffline") : translate(language, "goOnline")}
                </Button>
                <EmployeeSearch setFriend={e => { setFriend(e); setPage('friend') }} />
            </div>
        </div>

    )
}