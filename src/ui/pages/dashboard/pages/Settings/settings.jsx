import { useContext, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LanguageIcon from '@mui/icons-material/Language';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LanguageStore, ThemeStore } from '../../../../store/userStore';
import MyTheme from './Theme/MyTheme';
import MyLanguage from './Language/MyLanguage';
import translate from '../../../../language/translate';

export default function Settings() {
    const [theme] = useContext(ThemeStore);
    const [language] = useContext(LanguageStore);
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div style={{ margin: 40 }}>
            <Accordion
                expanded={expanded === "language"}
                onChange={handleChange("language")}
                disableGutters
                sx={{ border: `2px solid ${theme.text}` }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: theme.text }} />}
                    aria-controls="language"
                    id="language"
                    sx={{ background: `linear-gradient(145deg, ${theme.dark}, ${theme.medium})` }}
                >
                    <Typography
                        component="span"
                        sx={{
                            width: "33%",
                            flexShrink: 0,
                            color: theme.text,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <LanguageIcon fontSize="small" />
                        {translate(language,"language")}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ background: 'white' }}>
                    <MyLanguage />
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === 'theme'}
                onChange={handleChange('theme')}
                disableGutters
                sx={{ border: `2px solid ${theme.text}` }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: theme.text }} />}
                    aria-controls="theme"
                    id="theme"
                    sx={{ background: `linear-gradient(145deg, ${theme.dark}, ${theme.medium})` }}
                >
                    <Typography
                        component="span"
                        sx={{
                            width: "33%",
                            flexShrink: 0,
                            color: theme.text,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <ColorLensIcon fontSize="small" />
                        {translate(language,"theme")}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <MyTheme />
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
