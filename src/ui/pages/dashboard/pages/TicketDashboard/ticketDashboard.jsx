import { useContext, useState } from "react";
import { Box, Button } from "@mui/material";
import CreateTicket from "./components/CreateTicket";
import PendingTickets from "./components/PendingTickets";
import CompletedTickets from "./components/CompletedTicket";
import InProgressTicket from './components/InProgressTickets';
import { LanguageStore, ThemeStore, UserStore } from "../../../../store/userStore";
import translate from '../../../../language/translate'

const TicketDashboard = () => {
  const [hostUser] = useContext(UserStore);
  const [language] = useContext(LanguageStore)
  const [theme] = useContext(ThemeStore);
  const [tab, setTab] = useState("create");

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center", justifyContent: "center" }}>
        <Button
          sx={{ 
            background: tab === "create" ? theme.dark : theme.light,
            color: tab === "create" ? theme.light : theme.dark
          }}
          onClick={() => setTab("create")}
        >
          {translate(language,"create")}
        </Button>
        <Button
          sx={{ 
            background: tab === "pending" ? theme.dark : theme.light,
            color: tab === "pending" ? theme.light : theme.dark
          }}
          onClick={() => setTab("pending")}
        >
          {translate(language,"pending")}
        </Button>
        <Button
          sx={{ 
            background: tab === "inProgress" ? theme.dark : theme.light,
            color: tab === "inProgress" ? theme.light : theme.dark
          }}
          onClick={() => setTab("inProgress")}
        >
          {translate(language,"inProgress")}
        </Button>
        <Button
          sx={{ 
            background: tab === "completed" ? theme.dark : theme.light,
            color: tab === "completed" ? theme.light : theme.dark
          }}
          onClick={() => setTab("completed")}
        >
          {translate(language,"completed")}
        </Button>
      </Box>

      {tab === "create" && <CreateTicket userId={hostUser._id} userName={hostUser.staffName}/>}
      {tab === "pending" && <PendingTickets userId={hostUser._id}/>}
      {tab === "inProgress" && <InProgressTicket userId={hostUser._id}/>}
      {tab === "completed" && <CompletedTickets userId={hostUser._id}/>}
    </Box>
  );
};

export default TicketDashboard;
