import { useContext, useState } from "react";
import { Box } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import EmployeeRecords from "./components/employeeRecords.component.jsx";
import Productivity from "./components/Productivity.jsx";
import ShiftProgress from "./components/ShiftProgress.jsx";

import { ThemeStore, UserStore } from "../../../../store/userStore.jsx";

function LandingPage() {
    const [hostUser] = useContext(UserStore);
    const [theme] = useContext(ThemeStore);
    const [productivity, setProductivity] = useState(0);

    return (
        <Box>
            {hostUser.login==="false" && <Box
                sx={{
                    backgroundColor: theme.medium,
                    margin: 4,
                    padding: 2,
                    borderRadius: 10,
                    color: theme.dark
                }}
            >
                <strong>YOU ARE ON BREAK!</strong>
            </Box>}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    p: 3,
                    alignItems: "flex-start",
                }}
            >
                <Box>
                    <EmployeeRecords
                        user={hostUser}
                        setProductivity={(e) => setProductivity(e)}
                    />
                </Box>
                <Box>
                    <Productivity value={productivity} />
                </Box>
                <Box>
                    <ShiftProgress shiftStartTime={hostUser.shiftStartTime} />
                </Box>
            </Box>
        </Box>
    );
}

export default LandingPage;
