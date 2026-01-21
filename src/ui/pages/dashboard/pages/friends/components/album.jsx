import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Modal, Grid } from "@mui/material";
import axios from "axios";
import { BASE_API_URL } from "../../../../../data";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { LanguageStore, ThemeStore } from "../../../../../store/userStore";
import translate from "../../../../../language/translate";

function Album({ friend, user, imageRefresher }) {
    const [language] = useContext(LanguageStore);
    const [theme] = useContext(ThemeStore);
    const [images, setImages] = useState([]);
    const [zoomImage, setZoomImage] = useState(null);

    useEffect(() => {
        setImages([])
        let config = {
            method: 'get',
            url: `${BASE_API_URL}api/album/${friend?._id}`
        };
        axios.request(config)
            .then((response) => {
                console.log("Album response: ", response)
                if (response?.data?.data && response?.data?.data?.length > 0) {
                    setImages(response.data.data);
                }
            })
            .catch((error) => {}
        );
    }, [friend, imageRefresher]);

    const handleDelete = async (imageId) => {
        try {
            await axios.delete(`${BASE_API_URL}api/album/${imageId}`);
            setImages(prev => prev.filter(img => img._id !== imageId));
        } catch (err) {
        }
    };

    return (
        <>
            <Box
                sx={{
                    maxHeight: '70vh',
                    overflowY: "auto",       // scrollable
                    "&::-webkit-scrollbar": { display: "none" }, // hide scrollbar
                    scrollbarWidth: "none",  // for Firefox
                }}
            >
                <Grid container spacing={2}>
                    {images.length > 0 ? images.map((img, i) => (
                        <Grid item xs={6} sm={4} md={3} key={img._id || i}>
                            <Box sx={{ position: "relative" }}>
                                {friend?._id === user?._id && (
                                    <Box
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(img._id);
                                        }}
                                        sx={{
                                            position: "absolute",
                                            top: 6,
                                            right: 6,
                                            width: 26,
                                            height: 26,
                                            borderRadius: "50%",
                                            bgcolor: "rgba(255,0,0,0.9)",
                                            color: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 14,
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            zIndex: 2,
                                            "&:hover": { bgcolor: "red" },
                                        }}
                                    >
                                        <DeleteForeverIcon />
                                    </Box>
                                )}

                                <Box
                                    component="img"
                                    src={img.url}
                                    onClick={() => setZoomImage(img)}
                                    sx={{
                                        width: "100%",
                                        height: 140,
                                        objectFit: "cover",
                                        borderRadius: 2,
                                        cursor: "pointer",
                                    }}
                                />
                            </Box>
                        </Grid>
                    )) : (
                        <Typography sx={{ color: "#000000ff" }}>
                            {translate(language, "noImages")}
                        </Typography>
                    )}
                </Grid>
            </Box>

            {/* Zoom Modal */}
            <Modal open={Boolean(zoomImage)} onClose={() => setZoomImage(null)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "transparent",
                        p: 2,
                        outline: 'none',       
                        border: 'none',
                    }}
                >
                    <Box
                        component="img"
                        src={zoomImage?.url}
                        sx={{
                            width: 800,
                            height: 600,
                            objectFit: "contain",
                            borderRadius: 2,
                        }}
                    />
                    <Typography
                        sx={{
                            mt: 2,                  
                            textAlign: "center",    
                            fontWeight: "bold",     
                            fontSize: "1.5rem",     
                            width: "100%",         
                            bgcolor: theme.light,
                            color: theme.dark
                        }}
                    >
                        {zoomImage?.timestamp
                            ? new Date(zoomImage.timestamp).toLocaleString(undefined, {
                                dateStyle: 'long',
                                timeStyle: 'short'
                            })
                            : translate(language, "noDateAvailable")}
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}

export default Album;
