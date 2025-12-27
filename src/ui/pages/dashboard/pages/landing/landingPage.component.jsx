import { useContext, useState } from "react";
import { Box } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import EmployeeRecords from "./components/employeeRecords.component.jsx";
import Productivity from "./components/Productivity.jsx";
import ShiftProgress from "./components/ShiftProgress.jsx";

import { UserStore } from "../../../../store/userStore.jsx";

function LandingPage() {
    const [hostUser] = useContext(UserStore);
    const [productivity, setProductivity] = useState(0);

    return (
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
    );
}

export default LandingPage;
