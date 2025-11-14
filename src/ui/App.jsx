import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login/login.component.jsx'
import Dashboard from './pages/dashboard/dashboard.component.jsx';
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login isAuthenticated={user => {setIsAuthenticated(user)}} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard  user={isAuthenticated} isAuthenticated={user => {setIsAuthenticated(user)}} /> : <Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
