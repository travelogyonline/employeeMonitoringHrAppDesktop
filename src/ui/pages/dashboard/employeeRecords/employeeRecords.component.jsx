import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button
} from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimerIcon from "@mui/icons-material/Timer";

function EmployeeRecords({ user }) {
    const [firstLogin, setFirstLogin] = useState("--:--");
    const [lastLogin, setLastLogin] = useState("--:--");
    const [totalTime, setTotalTime] = useState("0h 0m");
    const [activeSession, setActiveSession] = useState("0m 0s");

    useEffect(() => {
        if (!user?._id) return;

        const today = new Date().toISOString().split("T")[0];

        const fetchLogs = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:5000/api/login/date/${user._id}`,
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

            const now = new Date();
            let totalMs = 0;

            logs.forEach((s) => {
                const login = new Date(s.login);
                const logout = s.logout ? new Date(s.logout) : now;
                totalMs += Math.max(0, logout - login);
            });

            // First login
            setFirstLogin(new Date(logs[0].login).toLocaleTimeString());

            // Last login
            const last = logs[logs.length - 1];
            setLastLogin(new Date(last.login).toLocaleTimeString());

            // Total worked time
            const totalSec = Math.floor(totalMs / 1000);
            const hrs = Math.floor(totalSec / 3600);
            const mins = Math.floor((totalSec % 3600) / 60);
            setTotalTime(`${hrs}h ${mins}m`);

            // Active session
            if (!last.logout) {
                const activeMs = now - new Date(last.login);
                const s = Math.floor(activeMs / 1000);
                const mm = Math.floor((s % 3600) / 60);
                const ss = s % 60;
                setActiveSession(`${mm}m ${ss}s`);
            } else {
                setActiveSession("0m 0s");
            }
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 1000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <Box
            sx={{
                width: "100%",
                mt: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                {user.name} — Work Overview
            </Typography>

            <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 900 }}>

                {/* First Login */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={3} sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1}>
                                <LoginIcon color="primary" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    First Login Today
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ mt: 1 }}>
                                {firstLogin}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Last Login */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={3} sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1}>
                                <LogoutIcon color="warning" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Last Login Today
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ mt: 1 }}>
                                {lastLogin}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Total Time Worked */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={3} sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1}>
                                <AccessTimeIcon color="success" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Total Time Worked Today
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ mt: 1 }}>
                                {totalTime}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Active Session */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={3} sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1}>
                                <TimerIcon color="secondary" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Current Active Session
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ mt: 1 }}>
                                {activeSession}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Box>
    );
}

export default EmployeeRecords;
