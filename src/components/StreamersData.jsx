import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import GetAppIcon from "@mui/icons-material/GetApp";
import InfoIcon from "@mui/icons-material/Info";
import RefreshIcon from "@mui/icons-material/Refresh";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TableStreamersComponent from "./TableStreamersComponent";

function StreamersData() {
  const [streamers, setStreamers] = useState([]);
  const [orderBy, setOrderBy] = useState("username");
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  useEffect(() => {
    fetchStreamers();
  }, []);

  const fetchStreamers = async () => {
    try {
      const response = await axios.get("https://ws-streamers-backend.onrender.com/streamers");
      setStreamers(response.data);
      setLastRefreshed(new Date().toLocaleString());
    } catch (error) {
      console.error("Error fetching streamers:", error);
    }
  };

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

  const handleRefresh = async () => {
    try {
      await axios.post("https://ws-streamers-backend.onrender.com/streamers", {}); 
      console.log("Refresh successfull");
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const getFilteredAndSortedStreamers = () => {
    return streamers
      .filter((streamer) =>
        streamer.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (orderBy === "username") {
          return order === "asc"
            ? a.username.localeCompare(b.username)
            : b.username.localeCompare(a.username);
        } else {
          const numA = parseFloat(a[orderBy].replace(/,/g, ""));
          const numB = parseFloat(b[orderBy].replace(/,/g, ""));
          return order === "asc" ? numA - numB : numB - numA;
        }
      });
  };

  const downloadCSV = async () => {
    try {
      // Obtener los datos de los streamers en formato JSON
      const response = await axios.get("https://ws-streamers-backend.onrender.com/streamers");

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
            <Tooltip title="Refresh Data">
              <IconButton aria-label="refresh" onClick={handleRefresh}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {lastRefreshed && (
              <span style={{ marginLeft: "10px" }}>
                Última actualización: {lastRefreshed}
              </span>
            )}
          </Box>
          <TableStreamersComponent
            streamers={streamers}
            orderBy={orderBy}
            order={order}
            searchTerm={searchTerm}
            handleRequestSort={handleRequestSort}
            downloadCSV={downloadCSV}
            formatNumberWithCommas={formatNumberWithCommas}
            getFilteredAndSortedStreamers={getFilteredAndSortedStreamers}
          />
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
