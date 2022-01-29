import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useAuth } from "src/authentication/AuthContext";
import { checkinEvent, checkEventExist } from "src/mysql_db_api/events";

export default function SignupModal({
  open,
  setOpen,
  event,
  setOpenAddiIfnor,
}) {
  const { userProfile, displayErrMess, setLoading } = useAuth();

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseAndSubmit = async () => {
    // check if user has already check into this particular event
    setLoading(true);
    console.log(event);
    const res0 = await checkEventExist(event.id, userProfile.psid);
    if (res0.data == true) {
      displayErrMess("You already checked/signed up this event.", "info");
    } else {
      if (event.need_checkin !== 1 && event.is_signup !== 1) {
        displayErrMess(
          "Sorry! You cannot checkin/signup at this time.",
          "info"
        );
      } else {
        const res = await checkinEvent(event.id, userProfile.psid);
        if (res.data) {
          setOpen(false);
          if (event.has_additional_infor) {
            setOpenAddiIfnor(true);
          }
          displayErrMess("You check in the Event successfully!", "success");
        } else {
          displayErrMess(
            "Sorry! You cannot checkin/signup at this time.",
            "warning"
          );
        }
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Possible point: {event.point}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you Sure you want sign up for this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseAndSubmit} color="primary">
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
