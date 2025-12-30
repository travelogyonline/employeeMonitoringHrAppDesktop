import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login/login.component.jsx'
import Dashboard from './pages/dashboard/dashboard.component.jsx';
import './App.css'
import { BASE_API_URL, APP_VERSION } from './data.jsx';
import { UserStore, DpStore, ThemeStore, LanguageStore } from './store/userStore.jsx';
import axios from 'axios';
import quit from './assets/quit.png';
import { Box, Paper, Typography, Button, Alert, AlertTitle, Divider } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const defaultTheme = {
  name: "Inferno Glow",
  text: "#FFFFFF",
  light: "#FFF3E0",
  medium: "#E65100",
  dark: "#451800"
}

function App() {
  const [hostUser, setHostUser] = useState(false);
  const [hostDp, setHostDp] = useState(null);
  const [theme, setTheme] = useState(defaultTheme);
  const [language, setLanguage] = useState("english");
  const [doesVersionMatched, setDoesVersionMatched] = useState(false);
  useEffect(() => {
    async function getUser() {
      const user = await window.electronStore.get("user");
      const dp = await window.electronStore.get("dp");
      const theme = await window.electronStore.get("theme");
      const language = await window.electronStore.get("language");
      if (user) setHostUser(user);
      if (dp) setHostDp(dp);
      if (theme) setTheme(theme);
      if (language) setLanguage(language);
    }
    getUser();
  }, [window.electronStore.get("user")]);

  useEffect(() => {
    axios.get(BASE_API_URL + 'api/winHappyBuddy')
      .then((response) => {
        if (response.data[0].version === APP_VERSION) {
          setDoesVersionMatched(true)
        }
      })
  }, []);
  return (
    <>
      {
        doesVersionMatched ?
          <LanguageStore.Provider value={[language, setLanguage]}>
            <UserStore.Provider value={[hostUser, setHostUser]}>
              <DpStore.Provider value={[hostDp, setHostDp]}>
                <ThemeStore.Provider value={[theme, setTheme]}>
                  <Routes>
                    <Route path="/" element={hostUser ? <Navigate to="/dashboard" /> : <Login setUser={user => { setHostUser(user) }} />} />
                    <Route path="/dashboard" element={hostUser ? <Dashboard setUser={user => { setHostUser(user) }} /> : <Navigate to="/" />} />
                  </Routes>
                </ThemeStore.Provider>
              </DpStore.Provider>
            </UserStore.Provider>
          </LanguageStore.Provider>
          :
          <div className="oldversionContainer">
            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  maxWidth: 600,
                  borderRadius: "18px",
                  background: "#ffffff",
                }}
              >
                {/* 🔥 WARNING BANNER */}
                <Alert
                  severity="warning"
                  icon={<WarningAmberIcon />}
                  sx={{
                    borderRadius: "12px",
                    mb: 3,
                  }}
                >
                  <AlertTitle><strong>Update Required</strong></AlertTitle>
                  You are using an outdated version of the application.
                  Please follow the steps below to update safely.
                </Alert>

                {/* Step 1 — DOWNLOAD */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <CloudDownloadIcon color="primary" sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Step 1 — Download the Latest Version
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Download the newest version first. Do not remove the old version
                      until the download is complete.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<OpenInNewIcon />}
                  sx={{
                    mb: 3,
                    width: "100%",
                    borderRadius: "12px",
                    py: 1.2,
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                  onClick={() =>
                    window.open("http://monitor.travelogy.online", "_blank")
                  }
                >
                  Download Latest Version
                </Button>

                <Divider sx={{ my: 3 }} />

                {/* Step 2 — QUIT */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <PowerSettingsNewIcon color="error" sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Step 2 — Quit the App Completely
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      After the download finishes, go to the system tray and select
                      <strong> Quit Completely</strong>.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <img
                    src={quit}
                    alt="Quit Screenshot"
                    style={{
                      maxWidth: "260px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Step 3 — REMOVE */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <DeleteForeverIcon sx={{ fontSize: 32, color: "#8b0000" }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Step 3 — Remove the Old Installer
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Once the new version is downloaded and the app is closed,
                      delete the old installer (EXE) from your system. <b>Only then open the new version</b>.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </div>

      }
    </>
  )
}

export default App
