import React from "react";
import { Button, Modal } from "react-bootstrap";
// import toast from "react-hot-toast";

export const ConfirmationModal = ({  funHandler, ...props }) => {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Are you sure you want to {funHandler?.title}?</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button
          className="btn btn-primary me-2"
          onClick={() => {
            funHandler.fun(funHandler?.id);
            props.onHide()
          }}
        >
          confirm
        </Button>
        <Button
          variant="secondary"
          className="btn btn-primary me-2"
          onClick={() => props.onHide()}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
