import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { Alert, AlertTitle } from "@material-ui/core";

export default function Loading({ message, type, setOpen }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert
        severity={type}
        className={classes.error}
        onClose={() => {
          setOpen(false);
        }}
      >
        <AlertTitle>{type}</AlertTitle>
        {message}
      </Alert>
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: "10px",
    width: "100vw",
    height: "20%",
    zIndex: 10000,
  },
  error: {
    height: "fit-content",
    width: "60%",
  },
});
