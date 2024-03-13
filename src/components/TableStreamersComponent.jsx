import React from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";

function TableStreamersComponent({
  streamers,
  orderBy,
  order,
  searchTerm,
  handleRequestSort,
  downloadCSV,
  formatNumberWithCommas,
  getFilteredAndSortedStreamers,
}) {
  const filteredAndSortedStreamers = getFilteredAndSortedStreamers();
  return (
    <>
      <div className="px-2 bg-gray-200 border-gray-500 text-gray-600">
        This process can take up to 50 seconds. Please wait...
      </div>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
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
            {filteredAndSortedStreamers.map((streamer) => (
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
      </TableContainer></>
  );
}

export default TableStreamersComponent;
