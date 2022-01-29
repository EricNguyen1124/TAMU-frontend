import React, { useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
// import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { MemberEventTab } from "../profile";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "src/authentication/AuthContext";
import {
  checkinEvent,
  checkEventExist,
  getOneEvent,
} from "src/mysql_db_api/events.js";

export default function EventLinkCheckin() {
  const history = useNavigate();
  const { userProfile, setLoading, displayErrMess } = useAuth();
  // console.log("eventid", event_id);
  // console.log("check in code", checkin_code);
  const { event_id, checkin_code } = useParams();
  const [event_info, setEvent_info] = useState();
  const user_psid = userProfile.psid;

  useEffect(async () => {
    try {
      setLoading(true);
      const res_ = await getOneEvent(event_id);
      console.log("event information: ", res_.data[0]);
      const event_ = res_.data[0];
      setEvent_info(event_);
    } catch (e) {
      console.log("Error: ", e);
      history("/404");
    } finally {
      setLoading(false);
    }
  }, []);
  function go_home() {
    history("/dashboard/app");
  }

  async function check_in() {
    try {
      setLoading(true);
      const res = await checkEventExist(event_id, user_psid);
      if (res.data) {
        displayErrMess(
          "Oh! You have already checked in for this event",
          "info"
        );
      } else {
        if (
          event_info.checkin_code === checkin_code &&
          event_info.need_checkin === 1
        ) {
          const res1 = await checkinEvent(event_id, user_psid);
          console.log("this is the res", res1);
          if (res1.data) {
            displayErrMess("Successfully check in for the event!", "success");
            history("/dashboard/my_events");
          } else {
            displayErrMess(
              "Ops! You are not allowed check-in for this event at this time!",
              "warning"
            );
          }
        } else {
          displayErrMess("Ops! The link/QR code is expired", "error");
        }
      }
    } catch (e) {
      console.log(e);
      displayErrMess(
        "Not checkin Successfully! The link is currently invalid or expired!",
        "info"
      );
      history("/dashboard/app");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Dialog
        open={true}
        // onClose={()=> setOpen(false)}
        fullWidth
        maxWidth="lg"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
          Thank you for attending our events! Please click 'check in' button to
          get your points for attending this event
        </DialogTitle>
        <DialogContent style={{ display: "flex", justifyContent: "center" }}>
          {/* <DialogContentText>thank you for checkin</DialogContentText> */}
          {/* <div style={{ display: "flex" }}> */}
          {event_info && (
            <MemberEventTab
              post={event_info}
              latestPostLarge={true}
              latestPost={true}
            />
          )}
          {/* </div> */}
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={go_home}
            size="large"
            color="primary"
          >
            Back to home
          </Button>
          <Button
            variant="contained"
            onClick={check_in}
            size="large"
            color="primary"
          >
            check in
          </Button>
          {/* <Button onClick={()=> setOpen} color="primary">
            Check-In
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}
