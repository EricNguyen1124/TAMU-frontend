import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/styles";
import { useTheme } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { useAuth } from "src/authentication/AuthContext.js";
import { fDateTime } from "src/utils/formatTime";
import VideoModal from "./VideoModal"

export default function Video({ video }) {
  const classes = useStyles();
  const { setLoading } = useAuth();
  function onClickVideo(videoid) {
    setLoading(true);
    window.open(`https://www.youtube.com/watch?v=${videoid}`, "_blank");
    setLoading(false);
  }
  const [showModal, setShowModal] = useState();

  if(showModal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  const modalHandler = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <div>
      <div>{showModal && <VideoModal className="modalContainer" closeModal={modalHandler} videoId={video.contentDetails.videoId}/>}</div>
      <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="div" variant="div" fontWeight={"bold"}>
              {video.snippet.title.toUpperCase()}
            </Typography>
            <Typography style={{ fontSize: "small" }} color="textSecondary">
              {fDateTime(video.snippet.publishedAt)}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton aria-label="play/pause">
              {/* <PlayArrowIcon
                className={classes.playIcon}
                onClick={() => onClickVideo(video.contentDetails.videoId)}
              /> */}
              <PlayArrowIcon
                className={classes.playIcon}
                onClick={modalHandler}
              />
            </IconButton>
          </div>
        </div>
        <CardMedia
          className={classes.cover}
          image={
            video.snippet.thumbnails.medium
              ? video.snippet.thumbnails.medium.url
              : null
          }
          des="Education Video Thumbnail"
        />
      </Card>
    </div>
  );
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "space-between",
    },
    details: {
      display: "flex",
      flexDirection: "column",
      maxWidth: "50%",
      overflow: "hidden",
      height: "25vh",
    },
    content: {
      flex: "1 0 auto",
      padding: "5px 20px",
    },
    cover: {
      width: "50%",
    },
    controls: {
      display: "flex",
      alignItems: "center",
    },
    playIcon: {
      height: 50,
      width: 50,
    },
  })
);
