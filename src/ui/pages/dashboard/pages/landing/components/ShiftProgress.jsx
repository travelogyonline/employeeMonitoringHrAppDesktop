import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Stack,
    Divider
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

const SHIFT_DURATION_HOURS = 10;

const format12Hour = (date) =>
    date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });

const ShiftProgress = ({ shiftStartTime }) => {
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState("--");

    useEffect(() => {
        if (!shiftStartTime) return;

        const update = () => {
            const now = new Date();

            const [h, m] = shiftStartTime.split(":").map(Number);
            const start = new Date();
            start.setHours(h, m, 0, 0);

            let end = new Date(start);
            end.setHours(start.getHours() + SHIFT_DURATION_HOURS);

            // Handle shift crossing midnight
            if (end <= start) {
                end.setDate(end.getDate() + 1);
            }

            const totalMs = end - start;
            const elapsedMs = Math.max(0, now - start);
            const remainingMs = Math.max(0, end - now);

            const percentage = Math.min(
                100,
                Math.max(0, (elapsedMs / totalMs) * 100)
            );

            const hrs = Math.floor(remainingMs / 3600000);
            const mins = Math.floor((remainingMs % 3600000) / 60000);

            setProgress(Number(percentage.toFixed(2)));
            setTimeLeft(`${hrs}h ${mins}m`);
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [shiftStartTime]);

    const [h, m] = shiftStartTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(h, m, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + SHIFT_DURATION_HOURS);

    return (
        <Card
            elevation={6}
            sx={{
                borderRadius: 4,
                background: "linear-gradient(135deg, #ffffff, #f5f7fa)",
                minWidth: 420
            }}
        >
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={600}>
                        Shift Overview
                    </Typography>

                    <Divider />

                    <Stack direction="row" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={1}>
                            <AccessTimeIcon color="primary" />
                            <Typography fontWeight={500}>
                                Start: {format12Hour(startDate)}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <ScheduleIcon color="success" />
                            <Typography fontWeight={500}>
                                End: {format12Hour(endDate)}
                            </Typography>
                        </Box>
                    </Stack>

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                        mt={2}
                    >
                        <CircularProgress
                            variant="determinate"
                            value={progress}
                            size={120}
                            thickness={4}
                        />
                        <Box
                            position="absolute"
                            textAlign="center"
                        >
                            <Typography variant="h6" fontWeight={700}>
                                {progress}%
                            </Typography>
                            <Typography variant="caption">
                                Shift Done
                            </Typography>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                        <HourglassBottomIcon color="warning" />
                        <Typography fontWeight={500}>
                            Time Left: {timeLeft}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ShiftProgress;
