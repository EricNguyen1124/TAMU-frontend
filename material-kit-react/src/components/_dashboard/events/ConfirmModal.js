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
  const { displayErrMess, setLoading, userProfile, isResume, setIsResume } =
    useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState();
  const host = "http://localhost:5000";
  async function upuloadFile(file, customer_id) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(
      `${host}/documents/upload_document/${customer_id}`,
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "multipart/form-data",
        },
      }
    );
    return res.json();
  }
  async function handleUploadFile() {
    setLoading(true);
    // e.preventDefault();
    const customerId = "123";
    const res = await upuloadFile(file, customerId);
    console.log("res upload file", res);
    if (res.data) {
      // const res1 = await getResumeInfo(userProfile.psid);
      // console.log("res1", res1);
      // setFileName(res1.data.resume_name);
      // setResumeLink(res1.data.resume_link);
      setOpenModal(false);
      // setFile(null);
      // setIsResume(true);
      displayErrMess("Uploaded file Successfully!", "success");
    } else {
      displayErrMess("Fail to upload file", "error");
    }

    setLoading(false);
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
            Please upload the invoice for <b>{title}</b>
          </DialogContentText>
          <br />
          <UploadInvoice
            file={file}
            setFile={setFile}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
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
              handleUploadFile();
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
