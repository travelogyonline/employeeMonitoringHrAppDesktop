import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login/login.component.jsx'
import Dashboard from './pages/dashboard/dashboard.component.jsx';
import './App.css'

function App() {
   const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initial check
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);

    // React to storage updates (login/logout)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setIsAuthenticated(!!updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  console.log("Is authenticated:", isAuthenticated);
  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
