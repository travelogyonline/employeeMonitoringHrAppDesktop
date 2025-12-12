import { useState, useEffect, useContext } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import EmployeeRecords from './components/employeeRecords.component.jsx';
import { BASE_API_URL } from '../../../../data.jsx';
import style from './landingPage.module.css';
import { UserStore } from '../../../../store/userStore.jsx';

function LandingPage() {
    const [hostUser, setHostUser] = useContext(UserStore)
    const [image, setImage] = useState(null);

    const handleCapture = async () => {
        if (status === 'false') return
        const img = await window.electronAPI.captureScreen();
        setImage(img);
        uploadScreenshot(img);
    };
    // Sending the app, that the laptop is awake
    useEffect(() => {
        window.electronAPI.sendMessage(true);
    }, []);
    useEffect(() => {
        handleCapture();

        const interval = setInterval(() => {
            handleCapture();
        }, 10 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        const cleanup = window.electronAPI.onUpdateData((data) => {
            setStatus(data);
        });

        return cleanup;
    }, []);

    const uploadScreenshot = async (img) => {
        try {
            if (!img) return;

            const response = await fetch(img);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append("image", blob, "screenshot.png");

            const upload = await fetch(BASE_API_URL + "api/screenshot/" + hostUser._id, {
                method: "POST",
                body: formData
            });

            await upload.json();

        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className={style.container}>
            <EmployeeRecords user={hostUser} />
        </div>
    );
}

export default LandingPage;