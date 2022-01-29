import { Button } from "@material-ui/core";
import React from "react";
import ReactPlayer from "react-player";
import "src/components/_dashboard/educations/VideoModal.css";

const Modal = ({ closeModal, videoId }) => {
  return (
    <>

      <div className="modalContainer">
      <Button className="button" onClick={closeModal} color="primary">
        Close
      </Button>
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoId}`}
          controls
          width={(window.screen.width > 1280) ? 1080 : window.screen.width - 20}
          height={(window.screen.width > 1280) ? 640 : window.screen.width - 20}
        />
      </div>
    </>
  );
};
export default Modal;