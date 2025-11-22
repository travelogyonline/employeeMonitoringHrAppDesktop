import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login/login.component.jsx'
import Dashboard from './pages/dashboard/dashboard.component.jsx';
import './App.css'
import { BASE_API_URL } from './data.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    async function getUser() {
      const user = await window.electronStore.get("user");
      if (user) setIsAuthenticated(user);
    }
    getUser();
  }, [window.electronStore.get("user")]);
  console.log("BAse api url: ", BASE_API_URL)
  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login isAuthenticated={user => { setIsAuthenticated(user) }} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={isAuthenticated} isAuthenticated={user => { setIsAuthenticated(user) }} /> : <Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
