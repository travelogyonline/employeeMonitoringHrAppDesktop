import { useState, useEffect, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { BASE_API_URL } from "../../../../../data";
import { DpStore } from "../../../../../store/userStore";

export default function ProfileAvatar({ client, user }) {
    const [hostDp, setHostDp] = useContext(DpStore);

    const clientUserId = client?._id;
    const hostUserId = user?._id;

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append("image", file);

        // try {
        //     await axios.post(`${BASE_API_URL}api/dp/${clientUserId}`, data, {
        //         headers: { "Content-Type": "multipart/form-data" },
        //     })
        //         .then(async res => {
        //             setHostDp(res.data.data.profilePicture);
        //             await window.electronStore.set("dp", res.data.data.profilePicture);
        //         })
        // } catch (err) {}
    };

    return (
        <div style={{ position: "relative", width: 140, margin: "auto" }}>
            {clientUserId === hostUserId ?
                <Avatar
                    src={hostDp || ""}
                    sx={{
                        width: 120,
                        height: 120,
                        margin: "auto",
                        fontSize: 40,
                        bgcolor: "#1976d2",
                    }}
                >
                    {!hostDp && client?.staffName?.charAt(0)}
                </Avatar>
                :
                <Avatar
                    src={client?.profilePicture || ""}
                    sx={{
                        width: 120,
                        height: 120,
                        margin: "auto",
                        fontSize: 40,
                        bgcolor: "#1976d2",
                    }}
                >
                    {!client?.profilePicture && client?.staffName?.charAt(0)}
                </Avatar>
            }


            {/* EDIT BUTTON */}
            {clientUserId === hostUserId && <IconButton
                sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 10,
                    background: "white",
                    boxShadow: 2,
                }}
                component="label"
            >
                <EditIcon />

                {/* Hidden file input */}
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleUpload}
                />
            </IconButton>}
        </div>
    );
}
