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

export default function CheckinModal({
  open,
  setOpen,
  event,
  setOpenAddiIfnor,
}) {
  const { userProfile, displayErrMess, setLoading } = useAuth();
  const [codeCheckin, setCodeCheckin] = useState("");

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseAndSubmit = async () => {
    // check if user has already check into this particular event
    setLoading(true);
    const res0 = await checkEventExist(event.id, userProfile.psid);
    if (res0.data) {
      displayErrMess("You already checked into this event.", "info");
    } else {
      if (event.need_checkin !== 1) {
        displayErrMess("Sorry! You cannot checkin at this time.", "info");
      } else {
        if (event.checkin_code == codeCheckin) {
          const res = await checkinEvent(event.id, userProfile.psid);
          if (res.data) {
            setOpen(false);
            if (event.has_additional_infor) {
              setOpenAddiIfnor(true);
            }
            displayErrMess("You check in the Event successfully!", "success");
          } else {
            displayErrMess("Sorry!You have typed the wrong code :(", "error");
          }
        } else displayErrMess("Sorry! Wrong code :(", "error");
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
        <DialogTitle id="form-dialog-title">Point: {event.point}</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter your code to check in</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Event Code"
            type="text"
            fullWidth
            value={codeCheckin}
            onChange={(event) => setCodeCheckin(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseAndSubmit} color="primary">
            Check-In
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
