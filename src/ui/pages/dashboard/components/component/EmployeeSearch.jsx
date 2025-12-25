import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Autocomplete
} from "@mui/material";

import { BASE_API_URL } from "../../../../data";
import { ThemeStore } from "../../../../store/userStore";

export default function EmployeeSearch({ setFriend }) {
  const [theme] = useContext(ThemeStore);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_API_URL}api/user`)
      .then((res) => {
        setEmployees(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (event, value) => {
    if (value) {
      setFriend(value)
    }
  };

  return (
    <Box sx={{ flexShrink: 0, width: 250, color: 'green' }}>

      {loading ? (
        <CircularProgress />
      ) : (
        <Autocomplete
          fullWidth
          options={employees}
          getOptionLabel={(option) => option.staffName}
          onChange={handleSelect}
          renderOption={(props, option) => (
            <li {...props} key={props.key}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  py: 0.5,
                }}
              >
                <Typography variant="body1" fontWeight={500} sx={{color: theme.dark}}>
                  {option.staffName}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{color: theme.medium}}>
                  {option.role}
                </Typography>
              </Box>
            </li>
          )}
          ListboxProps={{
            sx: {
              maxHeight: 300,
              overflowY: "auto",

              /* Hide scrollbar */
              scrollbarWidth: "none",          // Firefox
              "&::-webkit-scrollbar": {
                display: "none",               // Chrome / Safari
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search employee by name"
              variant="outlined"
            />
          )}
        />
      )}
    </Box>
  );
}
