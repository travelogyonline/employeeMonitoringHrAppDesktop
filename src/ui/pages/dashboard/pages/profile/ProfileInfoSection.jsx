import React, { useContext } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { LanguageStore, ThemeStore } from "../../../../store/userStore";
import translate from "../../../../language/translate";

const ProfileInfoSection = ({ title, fields }) => {
  const [theme] = useContext(ThemeStore);
  const [language] = useContext(LanguageStore);

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} mb={2} sx={{color: theme.dark}}>
        {translate(language,title)}
      </Typography>

      <Grid container spacing={2}>
        {Object.entries(fields).map(([label, value], index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Typography variant="body2" color="text.secondary" sx={{color: theme.dark}}>
              {translate(language,label)}:
            </Typography>
            <Typography fontWeight={500} sx={{color: theme.medium}}>
              {value || "—"}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProfileInfoSection;
