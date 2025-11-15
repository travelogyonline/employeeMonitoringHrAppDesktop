import { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function LoginTab({ isAuthenticated, user }) {
    const [login, setLogin] = useState('');
    useEffect(() => {
        console.log("user.login: ", user.login);
        setLogin(user.login);
    }, []);
    const handleLoginButton = async () => {
        const apiHelper = login !== 'false' ? "out" : "in";
        let config = {
            method: apiHelper === 'in' ? 'post' : 'patch',
            maxBodyLength: Infinity,
            url: `http://localhost:5000/api/login/${apiHelper}/${user._id}`,
            headers: {}
        };

        await axios.request(config)
            .then((response) => {
                const config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `http://localhost:5000/api/user/${response.data.data.userId}`,
                };

                axios.request(config)
                    .then((response) => {
                        async function handleFunction() {
                            await window.electronStore.set("user", response.data.data);
                            await isAuthenticated(response.data.data)
                        }
                        handleFunction();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                setLogin(login === 'false' ? 'true' : 'false')
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return (
        <div>
            {login !== 'false' &&
                <div>
                    <h1>{user.name} loged in!</h1>
                </div>}
            <Button variant="contained" onClick={handleLoginButton}>{login !== 'false' ? "Logout" : "Login"}</Button>
        </div>
    )
}

export default LoginTab;
