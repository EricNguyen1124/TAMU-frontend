import React, { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import { makeStyles } from "@material-ui/styles";
import { TableContainer } from "@material-ui/core";
// import IconButton from "@material-ui/core/IconButton";

export default function AdminSystem() {
  const [requests, setRequests] = useState([]);

  useEffect(()=> {
    axios.get("http://localhost:5000/files")
    .then(response => response.data)
    .then(data => setRequests(data));
  },[]);

  useEffect(()=> {
    console.log(requests);
  },[requests]);

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Website</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            requests.map((request) => {
              return(<TableRow
                key={request._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{request.invoiceDate}</TableCell>
                <TableCell>{request.invoiceAddress}</TableCell>
                <TableCell>{request.invoiceEmail}</TableCell>
                <TableCell>{request.invoicePrice}</TableCell>
                <TableCell>{request.invoiceWebsite}</TableCell>
              </TableRow>)
            })
          } 
        </TableBody>
      </Table>
    </TableContainer>
  );
}