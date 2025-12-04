import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login/login.component.jsx'
import Dashboard from './pages/dashboard/dashboard.component.jsx';
import './App.css'
import { BASE_API_URL, APP_VERSION } from './data.jsx';
import axios from 'axios';

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
        console.log("response: ", response.data[0].version);
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
          <div>
            This is an older version, Please remove this file and download the newer version
            Visit here to download "http://monitor.travelogy.online"
          </div>
      }
    </>
  )
}

export default App
