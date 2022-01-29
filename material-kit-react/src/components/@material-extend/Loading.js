import React from "react";
import { makeStyles } from "@material-ui/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Loading({ loading }) {
  const classes = useStyles();
  return (
    <>
      {loading ? (
        <div className={classes.root}>
          <CircularProgress size={80} />
        </div>
      ) : null}
    </>
  );
}

const useStyles = makeStyles({
  root: {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 100000,
    opacity: "50%",
  },
});
