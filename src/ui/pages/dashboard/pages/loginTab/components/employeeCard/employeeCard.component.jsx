import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import style from "./employeeCard.module.css";
import PersonIcon from "@mui/icons-material/Person";

export default function EmployeeCard() {
    return (
        <Card className={style.card}>
            {/* Left white content */}
            <Box className={style.leftSection}>
                
                {/* Profile Image */}
                <Box className={style.imageWrapper}>
                    <Avatar
                        src="https://via.placeholder.com/300"
                        alt="Employee"
                        className={style.avatar}
                    />
                </Box>

                {/* Name & Position */}
                <Typography variant="h5" className={style.name}>
                    JOHN SMITH
                </Typography>
                <Typography variant="subtitle2" className={style.position}>
                    POSITION HERE
                </Typography>

                {/* Details */}
                <Box className={style.details}>
                    <Typography><strong>ID No:</strong> 123456789</Typography>
                    <Typography><strong>DOB:</strong> MM/DD/YEAR</Typography>
                    <Typography><strong>Email:</strong> lorem@ipsum.com</Typography>
                    <Typography><strong>Phone:</strong> +000 000-00</Typography>
                </Box>
            </Box>

            {/* Right Blue Section */}
            <Box className={style.blueSection}></Box>
        </Card>
    );
}
