import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
    Box,
    Typography,
} from "@mui/material";

import TimerIcon from "@mui/icons-material/Timer";
import { BASE_API_URL } from "../../../../data";
import { LanguageStore, ThemeStore, UserStore } from "../../../../store/userStore";
import translate from '../../../../language/translate'

function CurrentSession() {
    const [hostUser, setHostUser] = useContext(UserStore);
    const [theme] = useContext(ThemeStore);
    const [language] = useContext(LanguageStore);
    const [firstLogin, setFirstLogin] = useState("--:--");
    const [lastLogin, setLastLogin] = useState("--:--");
    const [totalTime, setTotalTime] = useState("0h 0m");
    const [activeSession, setActiveSession] = useState("0m 0s");

    useEffect(() => {
        if (!hostUser?._id) return;

        const today = new Date().toISOString().split("T")[0];

        const fetchLogs = async () => {
            try {
                const response = await axios.post(
                    `${BASE_API_URL}api/login/date/${hostUser._id}`,
                    { date: today }
                );

                const logs = response.data?.data || [];
                if (!Array.isArray(logs)) return;

                calculateStats(logs);
            } catch (err) {
                // console.error("Fetch error:", err);
            }
        };

        const calculateStats = (logs) => {
            if (logs.length === 0) return;

            const now = new Date();
            let totalMs = 0;

            logs.forEach((s) => {
                const login = new Date(s.login);
                const logout = s.logout ? new Date(s.logout) : now;
                totalMs += Math.max(0, logout - login);
            });

            setFirstLogin(new Date(logs[0].login).toLocaleTimeString());

            const last = logs[logs.length - 1];
            setLastLogin(new Date(last.login).toLocaleTimeString());

            const totalSec = Math.floor(totalMs / 1000);
            const hrs = Math.floor(totalSec / 3600);
            const mins = Math.floor((totalSec % 3600) / 60);
            setTotalTime(`${hrs}h ${mins}m`);

            // 🔥 Active session in hours, minutes, seconds
            if (!last.logout) {
                const activeMs = now - new Date(last.login);
                const s = Math.floor(activeMs / 1000);

                const hh = Math.floor(s / 3600);
                const mm = Math.floor((s % 3600) / 60);
                const ss = s % 60;

                setActiveSession(`${hh}h ${mm}m ${ss}s`);
            } else {
                setActiveSession("0h 0m 0s");
            }
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 1000);
        return () => clearInterval(interval);
    }, [hostUser]);

    return (
        hostUser.login==='false'?<></>:
        <Box display="flex" alignItems="center" sx={{mr: '10px'}}>
            <TimerIcon color="secondary" />
            <Typography variant="subtitle1" fontWeight={600} sx={{color: theme.dark}}>
                {translate(language,"currentActiveSession")}: {activeSession}
            </Typography>
        </Box>
    );
}

export default CurrentSession;
