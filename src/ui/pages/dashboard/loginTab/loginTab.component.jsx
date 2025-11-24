import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import EmployeeRecords from '../employeeRecords/employeeRecords.component';
import { BASE_API_URL } from '../../../data';

function LoginTab({ isAuthenticated, user }) {
    const [login, setLogin] = useState('');
    const [image, setImage] = useState(null);

    const handleCapture = async () => {
        const img = await window.electronAPI.captureScreen();
        setImage(img);
        uploadScreenshot(img); // pass latest screenshot
    };
    useEffect(() => {
        // window.electronAPI.rendererReady();
        window.electronAPI.sendMessage(true);
    }, []);
    useEffect(() => {
        // Take screenshot immediately after login
        handleCapture();

        // Then repeat every 10 minutes
        const interval = setInterval(() => {
            handleCapture();
        }, 10 * 60 * 1000); // 10 min

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const cleanup = window.electronAPI.onUpdateData((data) => {
            console.log("Received from main:", data);
            setLogin(data);
        });

        return cleanup;
    }, []);
    useEffect(() => {
        setLogin(user.login);
    }, []);
    const handleLoginButton = async () => {
        const apiHelper = login !== 'false' ? "out" : "in";
        let config = {
            method: apiHelper === 'in' ? 'post' : 'patch',
            maxBodyLength: Infinity,
            url: `${BASE_API_URL}api/login/${apiHelper}/${user._id}`,
            headers: {}
        };

        await axios.request(config)
            .then((response) => {
                const config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `${BASE_API_URL}api/user/${response.data.data.userId}`,
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
    const uploadScreenshot = async (img) => {
        try {
            if (!img) return;

            const response = await fetch(img);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append("image", blob, "screenshot.png");

            const upload = await fetch(BASE_API_URL + "api/screenshot/" + user._id, {
                method: "POST",
                body: formData
            });

            const result = await upload.json();

        } catch (err) {
            console.error(err);
        }
    };
    return (
        <Box sx={{ mt: 5, textAlign: "center" }}>
            {login !== "false" && (
                <EmployeeRecords user={user} />
            )}

            <Button
                variant="contained"
                size="large"
                sx={{
                    mt: 4,
                    px: 4,
                    fontWeight: 600,
                    borderRadius: 2
                }}
                onClick={handleLoginButton}
            >
                {login !== "false" ? "Punch Out or Take Break" : "Start Working"}
            </Button>
        </Box>
    );
}

export default LoginTab;
