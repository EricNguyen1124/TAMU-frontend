import React, { useEffect, useState } from "react";
import { Button, Stack, TextField } from "@material-ui/core";
import { useAuth } from "src/authentication/AuthContext";
import { getResumeInfo, uploadResume } from "src/mysql_db_api/members";
import { Dialog, DialogActions, DialogTitle, Slide } from "@material-ui/core";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function Resume() {
  const { displayErrMess, setLoading, userProfile, isResume, setIsResume } =
    useAuth();
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [resume_link, setResumeLink] = useState("");
  const [openModal, setOpenModal] = useState(false);
  useEffect(async () => {
    const res = await getResumeInfo(userProfile.psid);
    console.log(res);
    if (res.data) {
      setFileName(res.data.resume_name);
      setResumeLink(res.data.resume_link);
    }
  }, []);
  async function handleUploadFile(e) {
    setLoading(true);
    e.preventDefault();
    const res = await uploadResume(userProfile.psid, file);
    console.log("res upload file", res);
    if (res.data) {
      const res1 = await getResumeInfo(userProfile.psid);
      console.log("res1", res1);
      setFileName(res1.data.resume_name);
      setResumeLink(res1.data.resume_link);
      setOpenModal(false);
      setFile(null);
      setIsResume(true);
      displayErrMess("Uploaded Resume Successfully!", "success");
    } else {
      displayErrMess("Fail to upload resume", "error");
    }

    setLoading(false);
  }

  const fileNameChange = (e) => {
    var regex = new RegExp("(.*?).(pdf)$");

    if (!regex.test(e.target.files[0].name.toLowerCase())) {
      displayErrMess("File must have .pdf extension!", "error");
      return;
    } else {
      const name = e.target.files[0].name.toLowerCase();
      setFileName(name);
      setFile(e.target.files[0]);
    }
  };
  const viewResume = async () => {
    setLoading(true);
    setTimeout(() => {
      window.open(resume_link, "_blank");
      setLoading(false);
    }, 1000);
  };
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      <Stack direction="row" spacing={2} style={{ marginBottom: "15px" }}>
        <TextField
          style={{ width: "50ch" }}
          value={fileName == "" ? "No Inspection Report Uploaded" : fileName}
          type="text"
          label="Inspection Report"
          disabled
        ></TextField>
        <Button
          style={{ padding: "5px", height: "55px", marginLeft: "10px" }}
          size="small"
          variant="outlined"
          component="span"
          onClick={() => setOpenModal(true)}
        >
          Upload New
        </Button>
        <Button
          style={{ padding: "5px", height: "55px", marginLeft: "10px" }}
          size="small"
          variant="outlined"
          component="span"
          onClick={viewResume}
          disabled={!isResume}
        >
          View
        </Button>
      </Stack>

<Stack direction="row" spacing={2} style={{ marginBottom: "15px" }}>
        <TextField
          style={{ width: "50ch" }}
          value={fileName == "" ? "No Inspection Invoice Uploaded" : fileName}
          type="text"
          label="Inspection Invoice"
          disabled
        ></TextField>
        <Button
          style={{ padding: "5px", height: "55px", marginLeft: "10px" }}
          size="small"
          variant="outlined"
          component="span"
          onClick={() => setOpenModal(true)}
        >
          Upload New
        </Button>
        <Button
          style={{ padding: "5px", height: "55px", marginLeft: "10px" }}
          size="small"
          variant="outlined"
          component="span"
          onClick={viewResume}
          disabled={!isResume}
        >
          View
        </Button>
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
            <Button className="btn-choose" variant="outlined" component="span" style={{marginLeft: "12px"}}>
              Choose Files
            </Button>
          </label>
          <div className="file-name">{file ? file.name : null}</div>
        </Stack>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUploadFile} disabled={!file} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
