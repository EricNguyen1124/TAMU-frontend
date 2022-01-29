import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { useAuth } from "src/authentication/AuthContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({
  open,
  setOpen,
  event_name,
  exc_func,
  setOpenAddiIfor,
}) {
  const { displayErrMess, setLoading } = useAuth();
  const handleClose = () => {
    setOpen(false);
  };
  const handleSunmitAndClose = async () => {
    setLoading(true);
    setOpen(false);
    const res = await exc_func();
    // console.log("signup or not", res);
    if (res.data && res.data.affectedRows > 0) {
      // if (event_name !== "Resume Review") {
        setOpenAddiIfor(true);
      // } else {
      //   displayErrMess(
      //     `Thank you for signing up for ${event_name}! Our PD Team will contact you shortly.`,
      //     "success"
      //   );
      // }
    } else if (res.data) {
      displayErrMess(`You just signed up today for ${event_name}!`, "info");
    } else {
      displayErrMess(
        `Oops! Something wrong. Cannot Sign up to the event`,
        "error"
      );
    }
    setLoading(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Next step!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to sign up for {event_name} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            NO
          </Button>
          <Button onClick={handleSunmitAndClose} color="primary">
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
