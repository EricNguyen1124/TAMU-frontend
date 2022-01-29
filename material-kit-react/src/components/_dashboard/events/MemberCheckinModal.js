import React, { useState, useEffect } from "react";
import { useAuth } from "src/authentication/AuthContext";
import { checkinEvent, checkEventExist } from "src/mysql_db_api/events";
import GeneralTable from "src/components/GeneralTable";
import peopleFill from "@iconify/icons-eva/people-fill";
import { Icon } from "@iconify/react";
import {
  Stack,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
// import { getAllMembersWithoutAdmin } from "src/mysql_db_api/members";
// import AllMembers from "src/pages/Members.js";
import MembersListForCheckIn from "./MemberTableForCheckin";
// import { getMembersForEvent } from "src/mysql_db_api/events.js";
// import Files from "../educations/Files";
export default function MemberModal({
  open,
  setOpen,
  event,
  // TABLE_HEAD,
  get_data,
}) {
  const { displayErrMess, setLoading } = useAuth();

  const [data, setData] = useState([]);
  // useEffect(async () => {
  //   setLoading(true);
  //   const res = await get_data(event.id);
  //   // const res1 = await getAllMembersWithoutAdmin();
  //   console.log("viet nguyencong", res1);
  //   if (res.data) {
  //     setData(res.data);
  //   } else {
  //     displayErrMess("Fail to fetch members data from db!", "error");
  //   }
  //   setLoading(false);
  // }, []);
  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth
        onClose={() => setOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          style={{
            paddingTop: 10,
            paddingBottom: 0,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {/* <Button startIcon={<Icon icon={peopleFill} />} variant="contained">
            {Event} 
          </Button> */}
          <h3>Event: {event.title} </h3>
          <div>
            <Button
              variant="contained"
              style={{ marginLeft: "5px" }}
              onClick={() => setOpen(false)}
            >
              x
            </Button>
          </div>
        </Stack>
        <DialogContent>
          <MembersListForCheckIn event_id={event.id} />
        </DialogContent>
      </Dialog>
    </>
  );
}
