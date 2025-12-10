import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login/login.component.jsx'
import Dashboard from './pages/dashboard/dashboard.component.jsx';
import './App.css'
import { BASE_API_URL, APP_VERSION } from './data.jsx';
import axios from 'axios';
import quit from './assets/quit.png';
import { Box, Paper, Typography, Button, Alert, AlertTitle, Divider } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doesVersionMatched, setDoesVersionMatched] = useState(false);
  useEffect(() => {
    async function getUser() {
      const user = await window.electronStore.get("user");
      if (user) setIsAuthenticated(user);
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
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login isAuthenticated={user => { setIsAuthenticated(user) }} />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={isAuthenticated} isAuthenticated={user => { setIsAuthenticated(user) }} /> : <Navigate to="/" />} />
          </Routes>
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
                  Please follow the steps below to update to the latest release.
                </Alert>

                {/* Step 1 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <PowerSettingsNewIcon color="error" sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Step 1 — Quit the App Completely
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Go to the system tray and click <strong>Quit Completely</strong>.
                    </Typography>
                  </Box>
                </Box>

                {/* Screenshot */}
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

                {/* Step 2 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <DeleteForeverIcon sx={{ fontSize: 32, color: "#8b0000" }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Step 2 — Remove Old Installer
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Delete the old EXE file from your system.
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Step 3 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CloudDownloadIcon color="primary" sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Step 3 — Download Latest Version
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click below to download the newest release.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<OpenInNewIcon />}
                  sx={{
                    mt: 3,
                    width: "100%",
                    borderRadius: "12px",
                    py: 1.2,
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                  onClick={() => window.open("http://monitor.travelogy.online", "_blank")}
                >
                  Download Latest Version
                </Button>
              </Paper>
            </Box>
          </div>
      }
    </>
  )
}

export default App
