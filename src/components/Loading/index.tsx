import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  })
);

export default function CircularUnderLoad() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress disableShrink />
    </div>
  );
}
