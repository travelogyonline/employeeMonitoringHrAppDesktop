import { useState, useEffect } from "react";
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

function EmployeeRecords({ user, setProductivity }) {
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
            } catch (err) {
                console.error("Fetch error:", err);
            }
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

            const totalSec = Math.floor(totalMs / 1000);
            const hrs = Math.floor(totalSec / 3600);
            const mins = Math.floor((totalSec % 3600) / 60);
            setTotalTime(`${hrs}h ${mins}m`);

            const breakSec = Math.floor(totalBreakMs / 1000);
            const breakHrs = Math.floor(breakSec / 3600);
            const breakMins = Math.floor((breakSec % 3600) / 60);
            setTotalBreak(`${breakHrs}h ${breakMins}m`);

            const totalEllipseTime = now - new Date(sortedLogs[0].login)
            const productivity = (totalMs / totalEllipseTime) * 100;
            setProductivity(productivity.toFixed(2))

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
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1}>
                                <LoginIcon color="primary" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    First Login Today: {firstLogin}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <LogoutIcon color="warning" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Last Login Today: {lastLogin}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <AccessTimeIcon color="success" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Total Time Worked Today: {totalTime}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <TimerIcon color="error" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Total Break Taken Today: {totalBreak}
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
