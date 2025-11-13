import { useState } from 'react'
// import Paper from '@mui/material/Paper';
// import { styled } from '@mui/material/styles';
// import Stack from '@mui/material/Stack';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import style from './dashboard.module.css'
// import axios from 'axios';
import { useNavigate } from "react-router-dom";


function Dashboard({ isAuthenticated }) {
    const navigate = useNavigate();
    return (
        <div>
            {/* {Object.values(user).map(item => (
                <div key={item.id}>{item}</div>
            ))} */}
            Hello
        </div>
    )
}

export default Dashboard;
