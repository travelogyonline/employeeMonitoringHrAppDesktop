import { useContext, useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Paper,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlagIcon from "@mui/icons-material/Flag";
import CategoryIcon from "@mui/icons-material/Category";
import ScheduleIcon from "@mui/icons-material/Schedule";
import UpdateIcon from "@mui/icons-material/Update";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { BASE_API_URL } from "../../../../../data";
import { LanguageStore, ThemeStore } from "../../../../../store/userStore";
import translate from "../../../../../language/translate";


const InProgressTicket = ({userId}) => {
  const [theme] = useContext(ThemeStore);
  const [language] = useContext(LanguageStore)
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const fetchPendingTickets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}api/ticket/inprogress/${userId}`
      );

      setTickets(data.tickets || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTickets();
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} textAlign="center" mb={3} sx={{color: theme.dark}}>
        {translate(language,"inProgressTickets")}
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        {loading ? (
          <Box py={6} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : tickets.length === 0 ? (
          <Box py={6}>
            <Typography textAlign="center" color="text.secondary">
              {translate(language,"noPendingTicketsFound")}
            </Typography>
          </Box>
        ) : (
          <div style={{background: theme.medium}}>
            {tickets.map((item) => (
              <Accordion
                key={item._id}
                expanded={expanded === item._id}
                onChange={handleChange(item._id)}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  "&:before": { display: "none" },
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)"
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: theme.text}}/>} sx={{
                  background: theme.dark,
                  color: theme.text
                }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography fontWeight={600}>
                        {item.title}
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Chip
                        label={item.priority}
                        color={
                          item.priority === "High"
                            ? "error"
                            : item.priority === "Medium"
                              ? "warning"
                              : "success"
                        }
                        size="small"
                        icon={<FlagIcon />}
                      />
                    </Grid>

                    <Grid item>
                      <Chip
                        label={item.status}
                        color={item.status === "Pending" ? "warning" : "success"}
                        sx={{background: theme.light}}
                        size="small"
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs>
                      <Typography
                        variant="body2"
                        align="right"
                      >
                        {dayjs(item.createdAt).format("DD MMM YYYY, hh:mm A")}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>

                {/* ================= DETAILS ================= */}
                <AccordionDetails sx={{background: theme.medium, color: theme.text}}>
                  <Box>
                    {/* Meta Info */}
                    <Grid container spacing={2} sx={{display: "flex", flexDirection: "column", alignItems: "flex-start"}} >
                      <Grid item xs={12} sm={6} md={4} sx={{display: 'flex'}}>
                        <Typography variant="body2" sx={{color: theme.dark, display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 2}}>
                          <CategoryIcon fontSize="small" sx={{ mr: 1 }} />
                          <strong>{translate(language,"category")}:</strong>
                        </Typography>
                        <Typography fontWeight={500}>
                          {item.category}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} sx={{display: 'flex'}}>
                        <Typography variant="body2" sx={{color: theme.dark, display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 2}}>
                          <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
                          <strong>{translate(language,"createdAt")}:</strong>
                        </Typography>
                        <Typography fontWeight={500}>
                          {dayjs(item.createdAt).format("DD MMM YYYY, hh:mm A")}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} sx={{display: 'flex'}}>
                        <Typography variant="body2" sx={{color: theme.dark, display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 2}}>
                          <UpdateIcon fontSize="small" sx={{ mr: 1 }} />
                          <strong>{translate(language,"lastUpdated")}:</strong>
                        </Typography>
                        <Typography fontWeight={500}>
                          {dayjs(item.updatedAt).format("DD MMM YYYY, hh:mm A")}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2, background: theme.text }} />

                    {/* Description */}
                    <Box mb={2}>
                      <Typography variant="subtitle2" sx={{color: theme.dark, display: 'flex', justifyContent: 'center', alignItems: 'center'}} gutterBottom>
                        <InfoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                        <strong>{translate(language,"description")}</strong>
                      </Typography>
                      <Typography variant="body2">
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        )}
      </Paper>
    </Box>
  );
};

export default InProgressTicket;
