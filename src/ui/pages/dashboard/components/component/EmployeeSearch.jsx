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
import { LanguageStore, ThemeStore } from "../../../../store/userStore";
import translate from '../../../../language/translate';

export default function EmployeeSearch({ setFriend }) {
  const [theme] = useContext(ThemeStore);
  const [language] = useContext(LanguageStore)
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
              scrollbarWidth: "none",          
              "&::-webkit-scrollbar": {
                display: "none",               
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={translate(language,"searchEmployeeByName")}
              variant="outlined"
            />
          )}
        />
      )}
    </Box>
  );
}
