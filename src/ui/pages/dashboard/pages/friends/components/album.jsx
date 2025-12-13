import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Modal,
    Grid,
} from "@mui/material";
import axios from "axios";
import { BASE_API_URL } from "../../../../../data";

// const images = [
//     "https://www.aegeanislands.gr/app/uploads/2020/06/Santorini-2-for-website-shutterstock_1361058167-1.jpg",
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR6_JxVZADytjj2ZIEHluJk1buVqd8jzDHZNDPl5HGNmiF2PrRqK0OjFapdr5PzBHfUvG01MYU",
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdb0U9XqjDdTG66DW4zX7S6FSrWmjoR8M9Bg&s",
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf50vOM_HQVJxv2Pb_M-Yk1LDfmONBp8HZTQ&s",
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmUNtt1Y-62rFWdEvXh6xPH7wLwKN6vx6cNA&s",
//     "https://footloosedev.com/wp-content/uploads/2016/01/bamboo-cottage.jpg",
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOaz5BjHt0uQ4poFXx4GEJQIZtW5G8nhMU5g&s",
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwqb-MvZDBKsNzcm3AbZlxaInmKQzYyxaP6A&s",
//     "https://images.squarespace-cdn.com/content/v1/5919f7bfd2b857811c061c2f/8d9c642d-b8c6-4527-9fac-4e3e85ff85c4/south-indian-temples-ranganathaswamy.jpg",
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG-NQzkyXqB-mMXvFznwB3Xnc6kIIn6HDrgQ&s",
//     "https://ichef.bbci.co.uk/news/480/cpsprodpb/16CC9/production/_103958339_mediaitem103958331.jpg.webp",
// ];

function Album({ friend }) {
    const [images,setImages] = useState(null);
    const [openAlbum, setOpenAlbum] = useState(false);
    const [zoomImage, setZoomImage] = useState(null);
    console.log("friend: ", friend)

    useEffect(() => {
        let config = {
            method: 'get',
            url: `${BASE_API_URL}api/album/${friend?._id}`
        }
        console.log("config: ", config)
        axios.request(config)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    return (
        images?
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

                    <Typography
                        sx={{ cursor: "pointer", color: "#1976d2" }}
                        onClick={() => setOpenAlbum(true)}
                    >
                        See more
                    </Typography>
                </Box>

                {/* Preview Images */}
                <Box sx={{
                    display: "flex", gap: 2, p: 2, overflowY: "auto",
                }}>
                    {images.slice(0, 4).map((img, i) => (
                        <Box
                            key={i}
                            component="img"
                            src={img}
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
                        {images.map((img, i) => (
                            <Grid item xs={6} sm={4} md={3} key={i}>
                                <Box
                                    component="img"
                                    src={img}
                                    onClick={() => setZoomImage(img)}
                                    sx={{
                                        width: "100%",
                                        height: 140,
                                        objectFit: "cover",
                                        borderRadius: 2,
                                        cursor: "pointer",
                                    }}
                                />
                            </Grid>
                        ))}
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
