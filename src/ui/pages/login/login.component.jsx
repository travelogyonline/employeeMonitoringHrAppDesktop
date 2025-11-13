import { useState } from 'react'
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import style from './login.module.css'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 400,
    padding: theme.spacing(4),
    ...theme.typography.body2,
    textAlign: 'center',
}));

function Login({isAuthenticated}) {
    const navigate = useNavigate();
    const [userid, setUserid] = useState();
    const [password, setPassword] = useState();
    const [userIdProps, setUserIdProps] = useState({});
    const [passwordProps, setPasswordProps] = useState({});
    const handleUserNameOnChange = (e) => {
        setUserid(e.target.value)
    }
    const handlePasswordOnChange = (e) => {
        setPassword(e.target.value)
    }
    const handleOnSubmit = e => {
        const payload = {
            email: userid,
            password: password
        }
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000/api/authenticate',
            headers: {
                'Content-Type': 'application/json'
            },
            data: payload
        };
        axios.request(config)
            .then((response) => {
                console.log(response.data);
                if (!response.data.status) {
                    if (response.data.issueWith === 'email') {
                        setUserIdProps({ error: true, helperText: response.data.message })
                        setPasswordProps({})
                    } else {
                        setPasswordProps({ error: true, helperText: response.data.message })
                        setUserIdProps({})
                    }
                } else {
                    setUserIdProps({})
                    setPasswordProps({})
                    isAuthenticated(response.data.data)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return (
        <div>
            <DemoPaper square={false} elevation={3}>
                <h1 className={style.header}>Travelogy</h1>
                <h2>Employee Login</h2>
                <p>Enter your credentials to log in</p>
                <Stack spacing={2}>
                    <TextField
                        {...userIdProps}
                        required
                        id="userId"
                        label="Email ID"
                        onChange={handleUserNameOnChange}
                        fullWidth
                    />
                    <TextField
                        {...passwordProps}
                        required
                        id="password"
                        label="Password"
                        type="password"
                        onChange={handlePasswordOnChange}
                        fullWidth
                    />
                    <Button variant="contained" onClick={handleOnSubmit} type="submit">Login</Button>
                </Stack>
            </DemoPaper>
            <div>

            </div>
        </div>
    )
}


export default Login;
