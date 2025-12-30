import { useContext, useEffect, useState } from "react";
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
import { LanguageStore, ThemeStore } from "../../../../../store/userStore";
import translate from '../../../../../language/translate';
import timeTranslator from "../../../../../language/timeTranslator";
import numeralTranslator from "../../../../../language/numeralTranslate";

const SHIFT_DURATION_HOURS = 10;


const ShiftProgress = ({ shiftStartTime }) => {
    const [theme] = useContext(ThemeStore);
    const [language] = useContext(LanguageStore);
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState("--");
    
    const format12Hour = (date) =>{
        const n = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
        return timeTranslator(language,n);
    }

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
                background: theme.light,
                minWidth: 420
            }}
        >
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={600} sx={{
                        color: theme.medium
                    }}>
                        {translate(language,"shiftOverview")}
                    </Typography>

                    <Divider />

                    <Stack direction="row" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={1}>
                            <AccessTimeIcon color="primary" />
                            <Typography fontWeight={500}>
                                <Box component="span" sx={{ color: theme.dark }}>
                                    {translate(language,"start")}:
                                </Box>{" "}
                                <Box component="span" sx={{ color: theme.medium }}>
                                    {format12Hour(startDate)}
                                </Box>
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <ScheduleIcon color="success" />
                            <Typography fontWeight={500}>
                                <Box component="span" sx={{ color: theme.dark }}>
                                    {translate(language,"end")}:
                                </Box>{" "}
                                <Box component="span" sx={{ color: theme.medium }}>
                                    {format12Hour(endDate)}
                                </Box>
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
                            sx={{ color: theme.dark }}
                        />
                        <Box
                            position="absolute"
                            textAlign="center"
                        >
                            <Typography variant="h6" fontWeight={700} sx={{ color: theme.medium }}>
                                {numeralTranslator(language,progress)}%
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.medium }}>
                                {translate(language,"shiftDone")}
                            </Typography>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                        <HourglassBottomIcon color="warning" />
                        <Typography fontWeight={500} sx={{ color: theme.medium }}>
                            {translate(language,"timeLeft")}: {timeLeft}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ShiftProgress;
