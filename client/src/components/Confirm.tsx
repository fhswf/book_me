import React, { useCallback } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export type ConfirmationDialogProps = {
  open: boolean;
  options: any;
  onCancel: React.MouseEventHandler<HTMLAnchorElement>;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const {
    title,
    description,
    confirmationText,
    cancellationText,
    dialogProps,
    confirmationButtonProps,
    cancellationButtonProps,
  } = props.options;

  return (
    <Dialog
      fullWidth
      {...dialogProps}
      open={props.open}
      onClose={props.onClose}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button {...cancellationButtonProps} onClick={props.onCancel}>
          {cancellationText}
        </Button>
        <Button
          color="primary"
          {...confirmationButtonProps}
          onClick={props.onConfirm}
        >
          {confirmationText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
