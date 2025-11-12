import { useState } from 'react'
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import style from './login.module.css'

const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 400,
    padding: theme.spacing(4),
    ...theme.typography.body2,
    textAlign: 'center',
}));

function Login() {

    return (
        <div>
            <DemoPaper square={false} elevation={3}>
                <h1 className={style.header}>Travelogy</h1>
                <h2>Employee Login</h2>
                <p>Enter your credentials to log in</p>
                <Stack spacing={2}>
                    <TextField
                        // error
                        // helperText="Incorrect User ID"
                        required
                        id="userId"
                        label="User ID"
                        fullWidth
                    />
                    <TextField
                        // error
                        // helperText="Incorrect Password"
                        required
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                    // autoComplete="current-password"
                    />
                </Stack>
            </DemoPaper>
            <div>

            </div>
        </div>
    )
}

export default Login
