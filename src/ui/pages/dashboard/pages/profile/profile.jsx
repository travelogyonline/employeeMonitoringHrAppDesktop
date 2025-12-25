import React, { useContext, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Chip,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import ProfileInfoSection from "./ProfileInfoSection";
import ChangePasswordModal from "./ChangePasswordModal.jsx";
import StatusPill from "./component/statusPill.jsx";
import { UserStore, DpStore, ThemeStore } from "../../../../store/userStore.jsx";

const Profile = () => {
  const [hostUser, setHostUser] = useContext(UserStore);
  const [theme] = useContext(ThemeStore);
  const [hostDp, setHostDp] = useContext(DpStore)
  if (!hostUser) return null;

  const [passwordModal, setPasswordModal] = useState(false);

  return (
    <Box sx={{ display: "flex", gap: 3, p: 3 }}>
      <Box flex={1}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          {/* Left: Avatar + Name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={hostDp || undefined}
              sx={{
                width: 70,
                height: 70,
                bgcolor: 'primary.main',
                fontSize: 28,
                fontWeight: 600,
              }}
            >
              {hostUser?.staffName?.charAt(0)?.toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ color: theme.dark }}>
                {hostUser.staffName}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
              >
                <Typography color="text.secondary" sx={{ color: theme.medium }}>
                  {hostUser.role}
                </Typography>

                <Chip
                  label={hostUser.staffStatus}
                  color={hostUser.staffStatus === "Active" ? "success" : "default"}
                  size="small"
                />

                <Chip
                  label={hostUser.staffID}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: theme.dark,
                    backgroundColor: theme.light,
                    borderColor: theme.dark
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Right: Change Password Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setPasswordModal(true)}
            sx={{
              textTransform: "none",
              color: theme.text,
              backgroundColor: theme.dark,
            }}
          >
            Change Password
          </Button>
        </Paper>

        {/* Details Section */}
        <Box mt={3}>
          <Paper sx={{ p: 3, borderRadius: "12px" }}>
            <Typography variant="h6" fontWeight={700} mb={2} sx={{color: theme.dark}}>
              Profile
            </Typography>

            <ProfileInfoSection
              title="Personal Information"
              fields={{
                "First Name": hostUser.staffName,
                Birthday: new Date(hostUser.dob).toDateString(),
                "Aadhar No": hostUser.aadhar,
                "Blood Group": hostUser.bloodGroup,
                Phone: hostUser.staffPhone,
                Email: hostUser.staffEmail,
                Gender: hostUser.gender,
                "Mother's Name": hostUser.motherName,
                "Father's Name": hostUser.fatherName,
                "Spouse Name": hostUser.spouseName,
                "PF Number": hostUser.pfNumber,
                "ESI Number": hostUser.esiNumber,
                "Physically Challenged": hostUser.physicallyChallenged,
              }}
            />

            <Divider sx={{ my: 3 }} />

            <ProfileInfoSection
              title="Professional Information"
              fields={{
                Designation: hostUser.designation,
                Role: hostUser.role,
                "Date of Joining": new Date(hostUser.doj).toDateString(),
                "Staff Type": hostUser.staffType,
                "Staff Status": hostUser.staffStatus,
                "Login Status": hostUser.login === 'false' ? <StatusPill status={false} /> : <StatusPill status={true} />,
                "UAN Number": hostUser.uanNumber,
              }}
            />

            <Divider sx={{ my: 3 }} />

            <ProfileInfoSection
              title="Address Information"
              fields={{
                "Address Line 1 (Present)": hostUser.addressLine1Present,
                "Address Line 2 (Present)": hostUser.addressLine2Present,
                "City (Present)": hostUser.addressCityPresent,
                "State (Present)": hostUser.addressStatePresent,
                "Pin (Present)": hostUser.addressPinPresent,

                "Address Line 1 (Permanent)": hostUser.addressLine1Permanent,
                "Address Line 2 (Permanent)": hostUser.addressLine2Permanent,
                "City (Permanent)": hostUser.addressCityPermanent,
                "State (Permanent)": hostUser.addressStatePermanent,
                "Pin (Permanent)": hostUser.addressPinPermanent,
              }}
            />
          </Paper>
        </Box>
      </Box>

      {/* Modal */}
      <ChangePasswordModal
        open={passwordModal}
        handleClose={() => setPasswordModal(false)}
        user={hostUser}
      />
    </Box>
  );
};

export default Profile;
