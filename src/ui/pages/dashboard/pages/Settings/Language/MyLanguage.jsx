import React, { useContext } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { LanguageStore, ThemeStore } from "../../../../../store/userStore";
import translate from "../../../../../language/translate";

const languages = [
  { key: "english", label: "English" },
  { key: "assamese", label: "অসমীয়া" },
  { key: "hindi", label: "हिन्दी" }
];

const MyLanguage = () => {
  const [language, setLanguage] = useContext(LanguageStore);
  const [theme] = useContext(ThemeStore);

  const handleSelect = async (lang) => {
    await window.electronStore.set("language", lang);
    setLanguage(lang);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        {translate(language, "selectLanguage")}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
        }}
      >
        {languages.map((lang) => {
          const selected = language === lang.key;

          return (
            <Paper
              key={lang.key}
              onClick={() => handleSelect(lang.key)}
              elevation={selected ? 6 : 1}
              sx={{
                cursor: "pointer",
                p: 2,
                textAlign: "center",
                borderRadius: 3,
                fontWeight: 600,
                transition: "all 0.25s ease",
                bgcolor: selected ? theme.dark : theme.light,
                color: selected ? theme.text: theme.dark,
                border: selected
                  ? `1px solid ${theme.dark}`
                  : "1px solid #ddd",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: selected
                    ? "0 8px 20px rgba(0,0,0,0.4)"
                    : "0 6px 16px rgba(0,0,0,0.15)",
                },
              }}
            >
              {lang.label}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default MyLanguage;
