import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import UploadInvoice from "./UploadInvoice";
import { useAuth } from "src/authentication/AuthContext";
import axios from "axios";

const Transition1 = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ReferModal({ taskID, open, setOpen, title, setDoneStatus }) {

  const handlePost = () => {
    axios.post(`http://localhost:5000/tasks/update/${taskID}}`)
    .then(res => {
      console.log(res.data)
    })
    .catch(error => {
      console.log(error)
    })
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition1}
        keepMounted
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Next Step!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Thank you for referring!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setOpen(false);
              handlePost();
            }}
            color="primary"
          >
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
