import { useState, useEffect, useContext } from "react";
import {
  Typography,
  Paper
} from "@mui/material";
import { LanguageStore, ThemeStore } from "../../../../../store/userStore";
import translate from '../../../../../language/translate';

export default function FriendThought({ friend }) {
  const [language] = useContext(LanguageStore);
  const [theme] = useContext(ThemeStore);
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Typography fontWeight={700} mb={1} sx={{ color: theme.text }}>
        {translate(language,"thoughts")}
      </Typography>
      {friend.myThoughts ? (
        <Typography variant="body2" sx={{ color: theme.text, mb: 2 }}>
          {friend.myThoughts}
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ color: theme.text, mb: 2 }}>
          {translate(language,"noThoughts")}
        </Typography>
      )}


    </Paper>
  );
}
