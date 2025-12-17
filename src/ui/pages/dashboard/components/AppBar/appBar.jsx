import style from './appBar.module.css';
import UserProfileBar from '../component/userBar';
import EmployeeSearch from '../component/EmployeeSearch';
import { useContext, useState, useEffect } from 'react';
import { UserStore } from '../../../../store/userStore';
import axios from 'axios';
import Button from "@mui/material/Button";
import { BASE_API_URL } from '../../../../data';
import CurrentSession from '../component/currentSession';

export default function AppBar({ setFriend, setPage }) {
    const [hostUser, setHostUser] = useContext(UserStore);
    const [status, setStatus] = useState('');
    useEffect(() => {
        setStatus(hostUser.login);
    }, []);
    const handleWorkingStatus = async () => {
        const apiHelper = status !== 'false' ? "out" : "in";
        let config = {
            method: apiHelper === 'in' ? 'post' : 'patch',
            url: `${BASE_API_URL}api/login/${apiHelper}/${hostUser._id}`,
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
                            setHostUser(response.data.data)
                        }
                        handleFunction();
                    })
                    .catch((error) => {
                        // console.log(error);
                    });
                setStatus(status === 'false' ? 'true' : 'false')
            })
            .catch((error) => {
                // console.log(error);
            });
    }
    return (
        <div className={style.appBar}>
            <div className={style.appBarText} onClick={() => { setFriend(hostUser); setPage('friend') }}>
                <UserProfileBar />
            </div>
            <div className={style.innerContainer}>
                <CurrentSession />
                <Button
                    variant="contained"
                    size="large"
                    className={style.button}
                    sx={{
                        // mt: 4,
                        mr: 4,
                        px: 4,
                        fontWeight: 600,
                        borderRadius: 2,
                        backgroundColor: status !== "false" ? 'red' : 'green'
                    }}
                    onClick={handleWorkingStatus}
                >
                    {status !== "false" ? "Go Offline!" : "Go Online!"}
                </Button>
                <EmployeeSearch setFriend={e => { setFriend(e); setPage('friend') }} />
            </div>
        </div>

    )
}