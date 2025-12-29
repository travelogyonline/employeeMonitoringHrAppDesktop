import { useState } from "react";
import { Box, Button } from "@mui/material";
import CreateTicket from "./components/CreateTicket";
import PendingTickets from "./components/PendingTickets";
import CompletedTickets from "./components/CompletedTicket";

const TicketDashboard = () => {
  const [tab, setTab] = useState("create");

  return (
    <Box sx={{ p: 3 }}>
      {/* TOP TABS */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center", justifyContent: "center" }}>
        <Button
          variant={tab === "create" ? "contained" : "outlined"}
          onClick={() => setTab("create")}
        >
          Create
        </Button>
        <Button
          variant={tab === "pending" ? "contained" : "outlined"}
          onClick={() => setTab("pending")}
        >
          Pending
        </Button>
        <Button
          variant={tab === "completed" ? "contained" : "outlined"}
          onClick={() => setTab("completed")}
        >
          Completed
        </Button>
      </Box>

      {/* CONTENT */}
      {tab === "create" && <CreateTicket />}
      {tab === "pending" && <PendingTickets />}
      {tab === "completed" && <CompletedTickets />}
    </Box>
  );
};

export default TicketDashboard;
