import React, { useEffect, useState } from "react";
import { Button, Stack, TextField } from "@material-ui/core";
import { useAuth } from "src/authentication/AuthContext";
import { getResumeInfo, uploadResume } from "src/mysql_db_api/members";
import { Dialog, DialogActions, DialogTitle, Slide } from "@material-ui/core";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function UploadInvoice({
  file,
  setFile,
  openModal,
  setOpenModal,
}) {
  const { displayErrMess, setLoading, userProfile, isResume, setIsResume } =
    useAuth();

  const [fileName, setFileName] = useState("");
  const [resume_link, setResumeLink] = useState("");

  useEffect(async () => {
    const res = await getResumeInfo(userProfile.psid);
    // console.log(res);
    if (res.data) {
      setFileName(res.data.resume_name);
      setResumeLink(res.data.resume_link);
    }
  }, []);

  const fileNameChange = async (e) => {
    var regex = new RegExp("(.*?).(pdf)$");

    if (!regex.test(e.target.files[0].name.toLowerCase())) {
      displayErrMess("File must have .pdf extension!", "error");
      return;
    } else {
      const name = e.target.files[0].name.toLowerCase();
      setFileName(name);
      setFile(e.target.files[0]);
      // await handleUploadFile();
    }
    setLoading(false);
  };

  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      <Stack direction="row" spacing={0} style={{ marginBottom: "15px" }}>
        <TextField
          style={{ width: "50ch" }}
          value={fileName == "" ? "No Resume Uploaded" : fileName}
          type="text"
          label="Resume"
          disabled
        ></TextField>
        <label htmlFor="btn-upload">
          <Button
            className="btn-choose"
            variant="outlined"
            component="span"
            style={{ marginLeft: "10px", height: "100%" }}
            onChange={fileNameChange}
          >
            Browse
          </Button>
        </label>
      </Stack>

      <Dialog
        open={openModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Uploading new file"}
        </DialogTitle>
        <Stack direction="row" spacing={2}>
          <label htmlFor="btn-upload">
            <input
              id="btn-upload"
              name="btn-upload"
              style={{ display: "none" }}
              type="file"
              accept=".pdf"
              onChange={fileNameChange}
            />
            <Button
              className="btn-choose"
              variant="outlined"
              component="span"
              style={{ marginLeft: "12px" }}
            >
              Choose Files
            </Button>
          </label>
          <div className="file-name">{file ? file.name : null}</div>
        </Stack>
      </Dialog>
    </>
  );
}
