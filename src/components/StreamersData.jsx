import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import GetAppIcon from "@mui/icons-material/GetApp";
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function StreamersData() {
  const [streamers, setStreamers] = useState([]);
  const [orderBy, setOrderBy] = useState("username");
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    async function fetchStreamers() {
      try {
        const response = await axios.get("http://localhost:5500/streamers");
        setStreamers(response.data);
      } catch (error) {
        console.error("Error fetching streamers:", error);
      }
    }

    fetchStreamers();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredAndSortedStreamers = () => {
    return streamers
      .filter(streamer =>
        streamer.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (orderBy === 'username') {
          return order === 'asc'
            ? a.username.localeCompare(b.username)
            : b.username.localeCompare(a.username);
        } else {
          const numA = parseFloat(a[orderBy].replace(/,/g, ''));
          const numB = parseFloat(b[orderBy].replace(/,/g, ''));
          return order === 'asc' ? numA - numB : numB - numA;
        }
      });
  };

  const downloadCSV = async () => {
    try {
      // Obtener los datos de los streamers en formato JSON
      const response = await axios.get("http://localhost:5500/streamers");

      // Convertir los datos JSON en formato CSV
      const streamersData = response.data;
      const csvData = convertJSONToCSV(streamersData);

      // Crear el archivo CSV y descargarlo
      const url = window.URL.createObjectURL(new Blob([csvData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "streamers.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const convertJSONToCSV = (data) => {
    const csvRows = [];

    const headers = Object.keys(data[0]).filter(
      (key) => key !== "_id" && key !== "__v" && key !== "updatedAt"
    );
    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = headers.map((header) => {
        const escapedValue = ("" + row[header]).replace(/"/g, '\\"');
        return `"${escapedValue}"`;
      });
      csvRows.push(values.join(","));
    }
    return csvRows.join("\n");
  };

  const handleReportClick = () => {
    setOpenAlert(true);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };
  return (
    <div className="container">
      <Box sx={{ width: "100%", margin: "40px" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              padding: "0 10px",
            }}
          >
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ mr: 1 }}
            />
            <IconButton aria-label="search">
              <SearchIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="download" onClick={downloadCSV}>
              <GetAppIcon fontSize="small" />
            </IconButton>
            <Tooltip title="Ver datos históricos">
              <IconButton aria-label="report" onClick={handleReportClick}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "username"}
                      direction={orderBy === "username" ? order : "asc"}
                      onClick={() => handleRequestSort("username")}
                    >
                      Username
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "averageViewers"}
                      direction={orderBy === "averageViewers" ? order : "asc"}
                      onClick={() => handleRequestSort("averageViewers")}
                    >
                      Average Viewers
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "peakViewers"}
                      direction={orderBy === "peakViewers" ? order : "asc"}
                      onClick={() => handleRequestSort("peakViewers")}
                    >
                      Peak Viewers
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "hoursWatched"}
                      direction={orderBy === "hoursWatched" ? order : "asc"}
                      onClick={() => handleRequestSort("hoursWatched")}
                    >
                      Hours Watched
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {getFilteredAndSortedStreamers().map((streamer) => (
                  <TableRow key={streamer._id}>
                    <TableCell>{streamer.username}</TableCell>
                    <TableCell>
                      {formatNumberWithCommas(streamer.averageViewers)}
                    </TableCell>
                    <TableCell>
                      {formatNumberWithCommas(streamer.peakViewers)}
                    </TableCell>
                    <TableCell>
                      {formatNumberWithCommas(streamer.hoursWatched)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleAlertClose}
          severity="warning"
        >
          Se requieren permisos para ver los datos históricos.
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default StreamersData;
