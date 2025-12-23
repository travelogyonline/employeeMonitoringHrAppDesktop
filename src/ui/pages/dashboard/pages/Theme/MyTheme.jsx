import { Box, Grid, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import { ThemeStore } from "../../../../store/userStore";

const palettes = [
    // Glow
    { name: "Azure Glow", dark: "#0D1A4D", medium: "#2F5BFF", light: "#EBF0FF", text: "#FFFFFF" },
    { name: "Sky Glow", dark: "#082945", medium: "#1E88E5", light: "#E3F2FD", text: "#FFFFFF" },
    { name: "Ocean Glow", dark: "#061F3D", medium: "#1565C0", light: "#E3F2FD", text: "#FFFFFF" },
    { name: "Midnight Glow", dark: "#031530", medium: "#0D47A1", light: "#E1F5FE", text: "#FFFFFF" },
    { name: "Arctic Glow", dark: "#202C40", medium: "#82B1FF", light: "#F0F5FF", text: "#000000" },
    { name: "Violet Glow", dark: "#211445", medium: "#7C4DFF", light: "#F1EDFF", text: "#FFFFFF" },
    { name: "Ultra Glow", dark: "#1A0845", medium: "#651FFF", light: "#EDE7FF", text: "#FFFFFF" },
    { name: "Royal Glow", dark: "#19003D", medium: "#6200EA", light: "#F3E5F5", text: "#FFFFFF" },
    { name: "Imperial Glow", dark: "#1A0F36", medium: "#512DA8", light: "#EDE7F6", text: "#FFFFFF" },
    { name: "Lavender Glow", dark: "#2A213D", medium: "#9575CD", light: "#F3E5F5", text: "#FFFFFF" },
    { name: "Evergreen Glow", dark: "#0D240E", medium: "#2E7D32", light: "#E8F5E9", text: "#FFFFFF" },
    { name: "Forest Glow", dark: "#112912", medium: "#388E3C", light: "#E8F5E9", text: "#FFFFFF" },
    { name: "Emerald Glow", dark: "#132E15", medium: "#43A047", light: "#E8F5E9", text: "#FFFFFF" },
    { name: "Mint Glow", dark: "#1B331D", medium: "#66BB6A", light: "#E8F5E9", text: "#000000" },
    { name: "Jungle Glow", dark: "#081C09", medium: "#1B5E20", light: "#E8F5E9", text: "#FFFFFF" },
    { name: "Solar Glow", dark: "#4D2E00", medium: "#FF9800", light: "#FFF3E0", text: "#000000" },
    { name: "Amber Glow", dark: "#4D2B00", medium: "#FB8C00", light: "#FFF3E0", text: "#000000" },
    { name: "Sunset Glow", dark: "#4A2600", medium: "#F57C00", light: "#FFF3E0", text: "#FFFFFF" },
    { name: "Lava Glow", dark: "#472100", medium: "#EF6C00", light: "#FFF3E0", text: "#FFFFFF" },
    { name: "Inferno Glow", dark: "#451800", medium: "#E65100", light: "#FFF3E0", text: "#FFFFFF" },
    { name: "Crimson Glow", dark: "#400E0E", medium: "#D32F2F", light: "#FFEBEE", text: "#FFFFFF" },
    { name: "Scarlet Glow", dark: "#451110", medium: "#E53935", light: "#FFEBEE", text: "#FFFFFF" },
    { name: "Fire Glow", dark: "#4A1411", medium: "#F44336", light: "#FFEBEE", text: "#FFFFFF" },
    { name: "Rose Glow", dark: "#471918", medium: "#EF5350", light: "#FFEBEE", text: "#FFFFFF" },
    { name: "Ruby Glow", dark: "#380808", medium: "#B71C1C", light: "#FFEBEE", text: "#FFFFFF" },
    { name: "Aqua Glow", dark: "#002E29", medium: "#009688", light: "#E0F2F1", text: "#FFFFFF" },
    { name: "Lagoon Glow", dark: "#0B332F", medium: "#26A69A", light: "#E0F2F1", text: "#FFFFFF" },
    { name: "Tide Glow", dark: "#002925", medium: "#00897B", light: "#E0F2F1", text: "#FFFFFF" },
    { name: "Teal Glow", dark: "#002420", medium: "#00796B", light: "#E0F2F1", text: "#FFFFFF" },
    { name: "Abyss Glow", dark: "#001713", medium: "#004D40", light: "#E0F2F1", text: "#FFFFFF" },

    // Core
    { name: "Azure Core", dark: "#45091D", medium: "#E91E63", light: "#FCE4EC", text: "#FFFFFF" },
    { name: "Sky Core", dark: "#471325", medium: "#EC407A", light: "#FCE4EC", text: "#FFFFFF" },
    { name: "Ocean Core", dark: "#42081D", medium: "#D81B60", light: "#FCE4EC", text: "#FFFFFF" },
    { name: "Midnight Core", dark: "#3B071C", medium: "#C2185B", light: "#FCE4EC", text: "#FFFFFF" },
    { name: "Arctic Core", dark: "#290418", medium: "#880E4F", light: "#FCE4EC", text: "#FFFFFF" },
    { name: "Violet Core", dark: "#131836", medium: "#3F51B5", light: "#E8EAF6", text: "#FFFFFF" },
    { name: "Ultra Core", dark: "#1C203B", medium: "#5C6BC0", light: "#E8EAF6", text: "#FFFFFF" },
    { name: "Royal Core", dark: "#111633", medium: "#3949AB", light: "#E8EAF6", text: "#FFFFFF" },
    { name: "Imperial Core", dark: "#0E1330", medium: "#303F9F", light: "#E8EAF6", text: "#FFFFFF" },
    { name: "Lavender Core", dark: "#080B26", medium: "#1A237E", light: "#E8EAF6", text: "#FFFFFF" },
    { name: "Evergreen Core", dark: "#241A16", medium: "#795548", light: "#EFEBE9", text: "#FFFFFF" },
    { name: "Forest Core", dark: "#2B211E", medium: "#8D6E63", light: "#EFEBE9", text: "#FFFFFF" },
    { name: "Emerald Core", dark: "#211714", medium: "#6D4C41", light: "#EFEBE9", text: "#FFFFFF" },
    { name: "Mint Core", dark: "#1C1311", medium: "#5D4037", light: "#EFEBE9", text: "#FFFFFF" },
    { name: "Jungle Core", dark: "#120B0A", medium: "#3E2723", light: "#EFEBE9", text: "#FFFFFF" },
    { name: "Solar Core", dark: "#1D2529", medium: "#607D8B", light: "#ECEFF1", text: "#FFFFFF" },
    { name: "Amber Core", dark: "#242B2E", medium: "#78909C", light: "#ECEFF1", text: "#000000" },
    { name: "Sunset Core", dark: "#192124", medium: "#546E7A", light: "#ECEFF1", text: "#FFFFFF" },
    { name: "Lava Core", dark: "#151B1E", medium: "#455A64", light: "#ECEFF1", text: "#FFFFFF" },
    { name: "Inferno Core", dark: "#0B0F11", medium: "#263238", light: "#ECEFF1", text: "#FFFFFF" },
    { name: "Crimson Core", dark: "#2F0B36", medium: "#9C27B0", light: "#F3E5F5", text: "#FFFFFF" },
    { name: "Scarlet Core", dark: "#331538", medium: "#AB47BC", light: "#F3E5F5", text: "#FFFFFF" },
    { name: "Fire Core", dark: "#2B0B33", medium: "#8E24AA", light: "#F3E5F5", text: "#FFFFFF" },
    { name: "Rose Core", dark: "#250930", medium: "#7B1FA2", light: "#F3E5F5", text: "#FFFFFF" },
    { name: "Ruby Core", dark: "#16062B", medium: "#4A148C", light: "#F3E5F5", text: "#FFFFFF" },
    { name: "Aqua Core", dark: "#3E4211", medium: "#CDDC39", light: "#F9FBE7", text: "#000000" },
    { name: "Lagoon Core", dark: "#3A3D0F", medium: "#C0CA33", light: "#F9FBE7", text: "#000000" },
    { name: "Tide Core", dark: "#35360D", medium: "#AFB42B", light: "#F9FBE7", text: "#000000" },
    { name: "Teal Core", dark: "#2F2F0B", medium: "#9E9D24", light: "#F9FBE7", text: "#000000" },
    { name: "Abyss Core", dark: "#272407", medium: "#827717", light: "#F9FBE7", text: "#FFFFFF" },

    // Edge
    { name: "Azure Edge", dark: "#003940", medium: "#00BCD4", light: "#E0F7FA", text: "#000000" },
    { name: "Sky Edge", dark: "#0B3C42", medium: "#26C6DA", light: "#E0F7FA", text: "#000000" },
    { name: "Ocean Edge", dark: "#00343A", medium: "#00ACC1", light: "#E0F7FA", text: "#FFFFFF" },
    { name: "Midnight Edge", dark: "#002D32", medium: "#0097A7", light: "#E0F7FA", text: "#FFFFFF" },
    { name: "Arctic Edge", dark: "#001D1E", medium: "#006064", light: "#E0F7FA", text: "#FFFFFF" },
    { name: "Violet Edge", dark: "#4D3A02", medium: "#FFC107", light: "#FFF8E1", text: "#000000" },
    { name: "Ultra Edge", dark: "#4D3600", medium: "#FFB300", light: "#FFF8E1", text: "#000000" },
    { name: "Royal Edge", dark: "#4D3000", medium: "#FFA000", light: "#FFF8E1", text: "#000000" },
    { name: "Imperial Edge", dark: "#4D2B00", medium: "#FF8F00", light: "#FFF8E1", text: "#000000" },
    { name: "Lavender Edge", dark: "#4D2100", medium: "#FF6F00", light: "#FFF8E1", text: "#FFFFFF" },
    { name: "Evergreen Edge", dark: "#173518", medium: "#4CAF50", light: "#E8F5E9", text: "#FFFFFF" },
    { name: "Forest Edge", dark: "#1F3820", medium: "#66BB6A", light: "#E8F5E9", text: "#000000" },
    { name: "Emerald Edge", dark: "#273B28", medium: "#81C784", light: "#E8F5E9", text: "#000000" },
    { name: "Mint Edge", dark: "#314032", medium: "#A5D6A7", light: "#E8F5E9", text: "#000000" },
    { name: "Jungle Edge", dark: "#0D240E", medium: "#2E7D32", light: "#E8F5E9", text: "#FFFFFF" },
    { name: "Solar Edge", dark: "#481D2C", medium: "#F06292", light: "#FCE4EC", text: "#FFFFFF" },
    { name: "Amber Edge", dark: "#492B35", medium: "#F48FB1", light: "#FCE4EC", text: "#000000" },
    { name: "Sunset Edge", dark: "#3E2C41", medium: "#CE93D8", light: "#F3E5F5", text: "#000000" },
    { name: "Lava Edge", dark: "#362F42", medium: "#B39DDB", light: "#EDE7F6", text: "#000000" },
    { name: "Inferno Edge", dark: "#303241", medium: "#9FA8DA", light: "#E8EAF6", text: "#000000" },
    { name: "Crimson Edge", dark: "#2B3D4B", medium: "#90CAF9", light: "#E3F2FD", text: "#000000" },
    { name: "Scarlet Edge", dark: "#1E364A", medium: "#64B5F6", light: "#E3F2FD", text: "#000000" },
    { name: "Fire Edge", dark: "#143149", medium: "#42A5F5", light: "#E3F2FD", text: "#FFFFFF" },
    { name: "Rose Edge", dark: "#0A2D49", medium: "#2196F3", light: "#E3F2FD", text: "#FFFFFF" },
    { name: "Ruby Edge", dark: "#07233F", medium: "#1976D2", light: "#E3F2FD", text: "#FFFFFF" },
];


function MyTheme() {
    const [theme,setTheme] = useContext(ThemeStore);
    const handleClick = async (value) => {
        await window.electronStore.get("theme", value);
        setTheme(value);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
                {palettes.map((palette) => (
                    <Grid item xs={6} sm={4} md={3} key={palette.name}>
                        <Paper
                            elevation={4}
                            onClick={() => handleClick(palette)}
                            sx={{
                                cursor: "pointer",
                                borderRadius: 2,
                                overflow: "hidden",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: 6,
                                },
                            }}
                        >
                            {/* Color preview */}
                            <Box
                                sx={{
                                    height: 80,
                                    backgroundColor: palette.medium,
                                }}
                            />

                            {/* Label */}
                            <Box sx={{ p: 1.2, textAlign: "center" }}>
                                <Typography fontSize="0.85rem" fontWeight={600}>
                                    {palette.name}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default MyTheme;
