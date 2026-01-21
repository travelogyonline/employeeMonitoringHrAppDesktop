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
import { UserStore, DpStore, ThemeStore, LanguageStore } from "../../../../store/userStore.jsx";
import translate from '../../../../language/translate.jsx'

const Profile = () => {
  const [hostUser, setHostUser] = useContext(UserStore);
  const [language] = useContext(LanguageStore);
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
            {/* <Avatar
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
            </Avatar> */}

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
            {translate(language,"changePassword")}
          </Button>
        </Paper>

        {/* Details Section */}
        <Box mt={3}>
          <Paper sx={{ p: 3, borderRadius: "12px" }}>
            <Typography variant="h6" fontWeight={700} mb={2} sx={{color: theme.dark}}>
              {translate(language,"profile")}
            </Typography>

            <ProfileInfoSection
              title="personalInformation"
              fields={{
                "firstName": hostUser.staffName,
                "birthday": new Date(hostUser.dob).toDateString(),
                "aadharNo": hostUser.aadhar,
                "bloodGroup": hostUser.bloodGroup,
                "phone": hostUser.staffPhone,
                "email": hostUser.staffEmail,
                "gender": hostUser.gender,
                "motherName": hostUser.motherName,
                "fatherName": hostUser.fatherName,
                "spouseName": hostUser.spouseName,
                "pfNumber": hostUser.pfNumber,
                "esiNumber": hostUser.esiNumber,
                "physicallyChallenged": hostUser.physicallyChallenged,
              }}
            />

            <Divider sx={{ my: 3 }} />

            <ProfileInfoSection
              title="professionalInformation"
              fields={{
                "designation": hostUser.designation,
                "role": hostUser.role,
                "dateOfJoining": new Date(hostUser.doj).toDateString(),
                "staffType": hostUser.staffType,
                "staffStatus": hostUser.staffStatus,
                "loginStatus": hostUser.login === 'false' ? <StatusPill status={false} /> : <StatusPill status={true} />,
                "uanNumber": hostUser.uanNumber,
              }}
            />

            <Divider sx={{ my: 3 }} />

            <ProfileInfoSection
              title="addressInformation"
              fields={{
                "addressLine1Present": hostUser.addressLine1Present,
                "addressLine2Present": hostUser.addressLine2Present,
                "cityPresent": hostUser.addressCityPresent,
                "statePresent": hostUser.addressStatePresent,
                "pinPresent": hostUser.addressPinPresent,

                "addressLine1Permanent": hostUser.addressLine1Permanent,
                "addressLine2Permanent": hostUser.addressLine2Permanent,
                "cityPermanent": hostUser.addressCityPermanent,
                "statePermanent": hostUser.addressStatePermanent,
                "pinPermanent": hostUser.addressPinPermanent,
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
