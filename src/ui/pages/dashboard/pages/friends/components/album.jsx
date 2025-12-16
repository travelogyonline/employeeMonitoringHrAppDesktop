import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Modal,
    Grid,
} from "@mui/material";
import axios from "axios";
import { BASE_API_URL } from "../../../../../data";


function Album({ friend, user, imageRefresher }) {
    const [images, setImages] = useState([]);
    const [openAlbum, setOpenAlbum] = useState(false);
    const [zoomImage, setZoomImage] = useState(null);
    console.log("images: ", images);
    useEffect(() => {
        let config = {
            method: 'get',
            url: `${BASE_API_URL}api/album/${friend?._id}`
        }
        axios.request(config)
            .then((response) => {
                if (response.data.data.length > 0) {
                    setImages(response.data.data[0].album)
                    console.log("album: ", response.data.data[0].album)
                }
            })
            .catch((error) => {
                console.log(error);
            });

    }, [friend, imageRefresher]);

    const handleDelete = async (imageId) => {
        try {
            await axios.delete(
                `${BASE_API_URL}api/album/${user._id}/pic/${imageId}`
            );

            // update UI instantly
            setImages((prev) => prev.filter((img) => img._id !== imageId));
        } catch (err) {
            console.error("Delete failed", err);
        }
    };


    return (
        images ?
            <>
                {/* SCROLLABLE ALBUM SECTION */}
                <Box
                    sx={{
                        maxHeight: 260,
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            px: 2,
                            mt: 2,
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Album
                        </Typography>

                        {images.length > 0 && <Typography
                            sx={{ cursor: "pointer", color: "#1976d2" }}
                            onClick={() => setOpenAlbum(true)}
                        >
                            See more
                        </Typography>}
                    </Box>

                    {/* Preview Images */}
                    <Box sx={{
                        display: "flex", gap: 2, p: 2, overflowY: "auto",
                    }}>
                        {images.slice(0, 4).map((img, i) => (
                            <Box
                                key={i}
                                component="img"
                                src={img.url}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    flexShrink: 0,
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Album Modal */}
                <Modal open={openAlbum} onClose={() => setOpenAlbum(false)}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "#000",
                            p: 3,
                            borderRadius: 3,
                            width: "85%",
                            maxHeight: "85vh",
                            overflowY: "auto",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ color: "#fff", mb: 2, fontWeight: 600 }}
                        >
                            Album
                        </Typography>

                        <Grid container spacing={2}>
                            {images.length > 0 ? images.map((img, i) => (
                                <Grid item xs={6} sm={4} md={3} key={img._id || i}>
                                    <Box sx={{ position: "relative" }}>

                                        {/* DELETE BUTTON */}
                                        {friend?._id === user?._id && (
                                            <Box
                                                onClick={(e) => {
                                                    e.stopPropagation(); // prevent zoom
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
                                                ✕
                                            </Box>
                                        )}

                                        <Box
                                            component="img"
                                            src={img.url}
                                            onClick={() => setZoomImage(img.url)}
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
                            )) : 
                            <Typography sx={{ color: "#000000ff" }}>
                                Upload your favorite images!
                            </Typography>

                            }

                        </Grid>
                    </Box>
                </Modal>

                {/* FIXED SIZE ZOOM MODAL */}
                <Modal open={Boolean(zoomImage)} onClose={() => setZoomImage(null)}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "#000",
                            p: 2,
                            borderRadius: 2,
                        }}
                    >
                        <Box
                            component="img"
                            src={zoomImage}
                            sx={{
                                width: 800,          // FIXED WIDTH
                                height: 600,         // FIXED HEIGHT
                                objectFit: "contain",
                                borderRadius: 2,
                            }}
                        />
                    </Box>
                </Modal>
            </> : <></>
    );
}

export default Album;
