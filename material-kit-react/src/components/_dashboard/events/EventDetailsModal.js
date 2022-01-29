import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
// import { useAuth } from "src/authentication/AuthContext";

const Transition1 = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function EventDetailsModal({
  open,
  setOpen,
  event_name,
  additional_information,
  more_content_link,
}) {
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
        <DialogTitle id="alert-dialog-slide-title">Event Details</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Event Name: {event_name}
            <br />
            <br />
            {additional_information}
            <br />
            {more_content_link && (
              <a href={more_content_link.toString().trim()} target="_blank">
                Click here
              </a>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setOpen(false)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
