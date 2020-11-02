import React, { ReactNode, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import Modal from "../../Modal";

const defaultToolbarStyles = {
  iconButton: {},
};

interface props {
  classes?: ReactNode;
}

const AddContactButton = (props: props) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { classes }: any = props;

  return (
    <>
      <Tooltip title={"custom icon"}>
        <IconButton className={classes.iconButton} onClick={handleClick}>
          <AddIcon className={classes.deleteIcon} />
        </IconButton>
      </Tooltip>
      <Modal open={open} handleClose={handleClose} />
    </>
  );
};

export default withStyles(defaultToolbarStyles, { name: "AddContactButton" })(
  AddContactButton
);
