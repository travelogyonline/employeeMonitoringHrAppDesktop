import { Box, Typography, CircularProgress, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function Productivity({ value = 0 }) {
  const getStatus = () => {
    if (value >= 75)
      return {
        colour: "#2e7d32",
        text: "Good Job!",
        icon: <CheckCircleIcon fontSize="small" />,
        bg: "rgba(46,125,50,0.1)",
      };
    if (value >= 40)
      return {
        colour: "#ed6c02",
        text: "Take less breaks",
        icon: <WarningAmberIcon fontSize="small" />,
        bg: "rgba(237,108,2,0.1)",
      };
    return {
      colour: "#d32f2f",
      text: "Concerning",
      icon: <ErrorOutlineIcon fontSize="small" />,
      bg: "rgba(211,47,47,0.1)",
    };
  };

  const status = getStatus();

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        width: 220,
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,242,245,0.95))",
        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2.5,
      }}
    >
      {/* Header */}
      <Typography
        variant="subtitle2"
        color="text.secondary"
        fontWeight={600}
        letterSpacing={0.5}
      >
        PRODUCTIVITY
      </Typography>

      {/* Circular Meter */}
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={value}
          size={110}
          thickness={4.5}
          sx={{
            color: status.colour,
            transition: "all 0.4s ease",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={800}
            color={status.colour}
          >
            {value}%
          </Typography>
        </Box>
      </Box>

      {/* Status Indicator */}
      <Chip
        icon={status.icon}
        label={status.text}
        sx={{
          fontWeight: 600,
          color: status.colour,
          backgroundColor: status.bg,
          borderRadius: 2,
          px: 1,
        }}
      />
    </Box>
  );
}

export default Productivity;
