import { Box, Typography, CircularProgress, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useContext } from "react";
import { LanguageStore, ThemeStore } from "../../../../../store/userStore";
import translate from "../../../../../language/translate";
import numeralTranslator from "../../../../../language/numeralTranslate";

function Productivity({ value = 0 }) {
  const [theme] = useContext(ThemeStore);
  const [language] = useContext(LanguageStore);
  const getStatus = () => {
    if (value >= 75)
      return {
        colour: "#2e7d32",
        text: "goodJob",
        icon: <CheckCircleIcon fontSize="small" />,
        bg: "rgba(46,125,50,0.1)",
      };
    if (value >= 40)
      return {
        colour: "#ed6c02",
        text: "takeLessBreaks",
        icon: <WarningAmberIcon fontSize="small" />,
        bg: "rgba(237,108,2,0.1)",
      };
    return {
      colour: "#d32f2f",
      text: "concerning",
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
          `linear-gradient(145deg, ${theme.light}, ${theme.text})`,
        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2.5,
      }}
    >
      <Typography
        variant="subtitle2"
        color={theme.medium}
        fontWeight={600}
        letterSpacing={0.5}
      >
        {translate(language, "productivity")}
      </Typography>

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
            {numeralTranslator(language,value)}%
          </Typography>
        </Box>
      </Box>

      <Chip
        icon={status.icon}
        label={translate(language,status.text)}
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
