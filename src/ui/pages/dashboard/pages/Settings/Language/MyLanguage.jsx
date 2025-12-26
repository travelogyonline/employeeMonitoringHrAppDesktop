import React, { useContext } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { LanguageStore } from "../../../../../store/userStore";
import translate from "../../../../../language/translate";

const MyLanguage = () => {
  const [language, setLanguage] = useContext(LanguageStore);
  const handleChange = async (event) => {
    await window.electronStore.set("language", event.target.value);
    setLanguage(event.target.value);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontWeight: 500 }}
      >
        {translate(language,"selectLanguage")}
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          value={language}
          onChange={handleChange}
          displayEmpty
          sx={{
            borderRadius: 2,
          }}
        >
          <MenuItem value="english">English</MenuItem>
          <MenuItem value="assamese">Assamese</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default MyLanguage;
