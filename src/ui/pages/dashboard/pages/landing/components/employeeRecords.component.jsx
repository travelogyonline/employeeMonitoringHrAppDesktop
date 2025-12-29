import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid
} from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimerIcon from "@mui/icons-material/Timer";
import { BASE_API_URL } from "../../../../../data";
import { LanguageStore, ThemeStore } from "../../../../../store/userStore";
import translate from "../../../../../language/translate";
import timeTranslator from "../../../../../language/timeTranslator";

function EmployeeRecords({ user, setProductivity }) {
    const [theme] = useContext(ThemeStore);
    const [language] = useContext(LanguageStore);
    const [firstLogin, setFirstLogin] = useState("--:--");
    const [lastLogin, setLastLogin] = useState("--:--");
    const [totalTime, setTotalTime] = useState("0h 0m");
    const [totalBreak, setTotalBreak] = useState("0h 0m");


    useEffect(() => {
        if (!user?._id) return;

        const today = new Date().toISOString().split("T")[0];

        const fetchLogs = async () => {
            try {
                const response = await axios.post(
                    `${BASE_API_URL}api/login/date/${user._id}`,
                    { date: today }
                );
                const logs = response.data?.data || [];
                if (!Array.isArray(logs)) return;
                calculateStats(logs);
            } catch (err) { }
        };

        const calculateStats = (logs) => {
            if (logs.length === 0) return;

            const sortedLogs = [...logs].sort(
                (a, b) => new Date(a.login) - new Date(b.login)
            );

            const now = new Date();
            let totalMs = 0;
            let totalBreakMs = 0;

            sortedLogs.forEach((s, i) => {
                const login = new Date(s.login);
                const logout = s.logout ? new Date(s.logout) : now;

                totalMs += Math.max(0, logout - login);

                const nextSession = sortedLogs[i + 1];
                if (nextSession && s.logout) {
                    const nextLogin = new Date(nextSession.login);
                    totalBreakMs += Math.max(0, nextLogin - logout);
                }
            });

            setFirstLogin(new Date(sortedLogs[0].login).toLocaleTimeString());

            const last = sortedLogs[sortedLogs.length - 1];
            setLastLogin(new Date(last.login).toLocaleTimeString());

            // Work time
            const totalSec = Math.floor(totalMs / 1000);
            const hrs = Math.floor(totalSec / 3600);
            const mins = Math.floor((totalSec % 3600) / 60);
            setTotalTime(`${hrs}h ${mins}m`);

            // Break time
            const breakSec = Math.floor(totalBreakMs / 1000);
            const breakHrs = Math.floor(breakSec / 3600);
            const breakMins = Math.floor((breakSec % 3600) / 60);
            setTotalBreak(`${breakHrs}h ${breakMins}m`);

            // ===== Productivity Logic =====
            const FREE_BREAK_MS = 60 * 60 * 1000; // 1 hour

            const excessBreakMs = Math.max(0, totalBreakMs - FREE_BREAK_MS);

            // If break <= 1 hour → productivity stays 100%
            let productivity = 100;

            if (excessBreakMs > 0) {
                const effectiveElapsedMs = totalMs + excessBreakMs;
                productivity = (totalMs / effectiveElapsedMs) * 100;
            }

            setProductivity(productivity.toFixed(2));
        };


        fetchLogs();
        const interval = setInterval(fetchLogs, 1000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <Box>
            <Grid container spacing={3} sx={{ maxWidth: 900 }}>
                <Grid item xs={12} sm={6}>
                    <Card elevation={3} sx={{ borderRadius: 3 }}>
                        <CardContent sx={{
                            background:
                                `linear-gradient(145deg, ${theme.light}, ${theme.text})`,
                        }}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <LoginIcon color="primary" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    <Box component="span" sx={{ color: theme.dark }}>
                                        {translate(language, "firstLoginToday")}:
                                    </Box>{" "}
                                    <Box component="span" sx={{ color: theme.medium }}>
                                        {timeTranslator(language, firstLogin)}
                                    </Box>
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <LogoutIcon color="warning" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    <Box component="span" sx={{ color: theme.dark }}>
                                        {translate(language, "lastLoginToday")}:
                                    </Box>{" "}
                                    <Box component="span" sx={{ color: theme.medium }}>
                                        {timeTranslator(language, lastLogin)}
                                    </Box>
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <AccessTimeIcon color="success" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    <Box component="span" sx={{ color: theme.dark }}>
                                        {translate(language, "totalTimeWorkedToday")}:
                                    </Box>{" "}
                                    <Box component="span" sx={{ color: theme.medium }}>
                                        {timeTranslator(language, totalTime)}
                                    </Box>
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <TimerIcon color="error" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    <Box component="span" sx={{ color: theme.dark }}>
                                        {translate(language, "totalBreakTakenToday")}:
                                    </Box>{" "}
                                    <Box component="span" sx={{ color: theme.medium }}>
                                        {timeTranslator(language, totalBreak)}
                                    </Box>
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default EmployeeRecords;
