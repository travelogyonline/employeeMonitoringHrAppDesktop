import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Autocomplete
} from "@mui/material";

import { BASE_API_URL } from "../../../../data";

export default function EmployeeSearch({setFriend}) {
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
    <Box sx={{ flexShrink: 0, width: 250 }}>

      {loading ? (
        <CircularProgress />
      ) : (
        <Autocomplete
          fullWidth
          options={employees}
          getOptionLabel={(option) => option.staffName}
          onChange={handleSelect}
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
