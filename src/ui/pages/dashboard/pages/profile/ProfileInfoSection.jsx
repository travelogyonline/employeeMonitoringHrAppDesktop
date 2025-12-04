import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const ProfileInfoSection = ({ title, fields }) => {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        {title}
      </Typography>

      <Grid container spacing={2}>
        {Object.entries(fields).map(([label, value], index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Typography variant="body2" color="text.secondary">
              {label}:
            </Typography>
            <Typography fontWeight={500}>
              {value || "—"}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProfileInfoSection;
