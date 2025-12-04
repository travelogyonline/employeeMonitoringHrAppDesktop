import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Chip,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import ProfileInfoSection from "./ProfileInfoSection";

const Profile = ({ user }) => {
  if (!user) return null;

  return (
    <Box sx={{ display: "flex", gap: 3, p: 3 }}>
      <Box flex={1}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          <Avatar
            src="/default-profile.png"
            sx={{ width: 70, height: 70 }}
          />

          <Box>
            <Typography variant="h5" fontWeight={600}>
              {user.staffName}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
              <Typography color="text.secondary">
                {user.role}
              </Typography>

              <Chip
                label={user.staffStatus}
                color={user.staffStatus === "Active" ? "success" : "default"}
                size="small"
              />

              <Chip
                label={user.staffID}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </Paper>

        <Box mt={3}>
          <Paper sx={{ p: 3, borderRadius: "12px" }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Profile
            </Typography>

            <ProfileInfoSection
              title="Personal Information"
              fields={{
                "First Name": user.staffName,
                "Birthday": new Date(user.dob).toDateString(),
                "Aadhar No": user.aadhar,
                "Blood Group": user.bloodGroup,
                "Phone": user.staffPhone,
                "Email": user.staffEmail,
                "Gender": user.gender,
                "Mother's Name": user.motherName,
                "Father's Name": user.fatherName,
                "Spouse Name": user.spouseName,
                "PF Number": user.pfNumber,
                "ESI Number": user.esiNumber,
                "Physically Challenged": user.physicallyChallenged,
              }}
            />

            <Divider sx={{ my: 3 }} />

            <ProfileInfoSection
              title="Professional Information"
              fields={{
                "Designation": user.designation,
                "Role": user.role,
                "Date of Joining": new Date(user.doj).toDateString(),
                "Staff Type": user.staffType,
                "Staff Status": user.staffStatus,
                "Login Status": user.login,
                "UAN Number": user.uanNumber,
              }}
            />

            <Divider sx={{ my: 3 }} />

            <ProfileInfoSection
              title="Address Information"
              fields={{
                "Address Line 1 (Present)": user.addressLine1Present,
                "Address Line 2 (Present)": user.addressLine2Present,
                "City (Present)": user.addressCityPresent,
                "State (Present)": user.addressStatePresent,
                "Pin (Present)": user.addressPinPresent,

                "Address Line 1 (Permanent)": user.addressLine1Permanent,
                "Address Line 2 (Permanent)": user.addressLine2Permanent,
                "City (Permanent)": user.addressCityPermanent,
                "State (Permanent)": user.addressStatePermanent,
                "Pin (Permanent)": user.addressPinPermanent,
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
