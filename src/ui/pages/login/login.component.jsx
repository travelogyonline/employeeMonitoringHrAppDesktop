import { useContext, useState } from 'react'
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import style from './login.module.css';
import axios from 'axios';
import { BASE_API_URL } from '../../data';
import { DpStore } from '../../store/userStore';

const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 420,
    padding: theme.spacing(4),
    textAlign: 'center',
    borderRadius: 10,
    boxShadow: '0px 8px 25px rgba(0,0,0,0.15)'
}));

function Login({ setUser }) {
    const [hostDp, setHostDp] = useContext(DpStore);
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    const [userIdProps, setUserIdProps] = useState({});
    const [passwordProps, setPasswordProps] = useState({});

    const handleOnSubmit = () => {
        const payload = { staffEmail: userid, password };

        axios.post(BASE_API_URL + 'api/authenticate', payload)
            .then((response) => {
                if (!response.data.status) {
                    if (response.data.issueWith === 'email') {
                        setUserIdProps({ error: true, helperText: response.data.message });
                        setPasswordProps({});
                    } else {
                        setPasswordProps({ error: true, helperText: response.data.message });
                        setUserIdProps({});
                    }
                } else {
                    setUserIdProps({});
                    setPasswordProps({});
                    async function handleFunction() {
                        await window.electronStore.set("user", response.data.data);
                        setUser(response.data.data);
                        try {
                            const res = await axios.get(`${BASE_API_URL}api/dp/${response.data.data._id}`);

                            if (res.data?.data?.length > 0) {
                                setHostDp(res.data.data[0].profilePicture);
                                await window.electronStore.set("dp", res.data.data[0].profilePicture);
                            } else {
                                setHostDp(null)
                                await window.electronStore.set("dp", null);
                            }
                        } catch (err) {}
                    }
                    handleFunction();
                }
            })
    };

    return (
        <div className={style.wrapper}>

            <div className={style.cardWrapper}>
                <DemoPaper>
                    <h1 className={style.header}>Travelogy</h1>
                    <h2 className={style.subHeader}>Employee Login</h2>
                    <p className={style.description}>Enter your credentials to log in</p>

                    <Stack spacing={2}>
                        <TextField
                            {...userIdProps}
                            label="Email ID"
                            fullWidth
                            required
                            value={userid}
                            onChange={(e) => setUserid(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleOnSubmit()}
                        />

                        <TextField
                            {...passwordProps}
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleOnSubmit()}
                        />

                        <Button
                            variant="contained"
                            onClick={handleOnSubmit}
                            sx={{
                                backgroundColor: '#44a33b',
                                padding: '10px',
                                fontWeight: '600',
                                ":hover": {
                                    backgroundColor: '#3b8f33'
                                }
                            }}
                        >
                            LOGIN
                        </Button>
                    </Stack>
                </DemoPaper>
            </div>
        </div>
    );
}

export default Login;
