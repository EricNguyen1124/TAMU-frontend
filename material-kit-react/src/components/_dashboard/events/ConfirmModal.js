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

const Transition1 = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ConfirmModal({ open, setOpen, title, setDoneStatus }) {
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
            Please upload the invoice for <b>{title}</b>
          </DialogContentText>
          <br/>
          <UploadInvoice />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setOpen(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpen(false);
              setDoneStatus((prev) => !prev);

            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
