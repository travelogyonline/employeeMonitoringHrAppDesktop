import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  CircularProgress
} from "@mui/material";
import axios from "axios";
import { BASE_API_URL } from "../../../../../data";
import dayjs from "dayjs";
import { UserStore } from "../../../../../store/userStore";

const PendingTicket = () => {
  const [hostUser] = useContext(UserStore);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingTickets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}api/ticket/pending/${hostUser._id}`
      );

      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Failed to fetch pending tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTickets();
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
        Pending Tickets
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        {loading ? (
          <Box py={6} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : tickets.length === 0 ? (
          <Box py={6}>
            <Typography textAlign="center" color="text.secondary">
              No pending tickets found
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
              <TableRow>
                <TableCell align="center"><b>ID</b></TableCell>
                <TableCell align="center"><b>Title</b></TableCell>
                <TableCell align="center"><b>Category</b></TableCell>
                <TableCell align="center"><b>Priority</b></TableCell>
                <TableCell align="center"><b>Status</b></TableCell>
                <TableCell align="center"><b>Created</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tickets.map((t) => (
                <TableRow key={t._id} hover>
                  <TableCell align="center">
                    {t._id}
                  </TableCell>

                  <TableCell align="center">
                    {t.title}
                  </TableCell>

                  <TableCell align="center">
                    <Chip label={t.category} size="small" />
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={t.priority}
                      color={
                        t.priority === "High"
                          ? "error"
                          : t.priority === "Medium"
                          ? "warning"
                          : "success"
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={t.status}
                      color={
                        t.status === "Pending"
                          ? "warning"
                          : "info"
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="center">
                    {dayjs(t.createdAt).format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default PendingTicket;
