// import { useState } from 'react'
// import Paper from '@mui/material/Paper';
// import { styled } from '@mui/material/styles';
// import Stack from '@mui/material/Stack';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import style from './dashboard.module.css'
// import axios from 'axios';
import { useNavigate } from "react-router-dom";


function Dashboard() {
    const navigate = useNavigate();
    const handleLogout = () => {
        console.log("button pressed: ", localStorage)
        localStorage.clear();
        console.log("After clear: ", localStorage)
        navigate("/");
    };
    return (
        <button onClick={handleLogout}>
            Abhilekh Dowerah
        </button>
    )
}

export default Dashboard;
