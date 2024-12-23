import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const ConfirmationResonModal = ({ funHandler, ...props }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (data?.reason) {
      funHandler.fun(funHandler?.id, data?.reason);
      reset()
      props.onHide()

    } else {
      funHandler.fun(funHandler?.id, "");
      reset()
      props.onHide()
    }
  };
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
        <form  onSubmit={handleSubmit(onSubmit)} className="w-100">
          {/* form group */}
          {funHandler?.isGetReson ? (
            <div className="mb-4 col-md-12 col-12">
              <label className="form-label">
              {funHandler?.lable} <span className="text-danger">*</span>
              </label>
              <textarea
                type="text"
                rows={5}
                className="form-control"
                placeholder="Enter Description"
                {...register("reason", {
                  required: "Reason is required",
                })}
              ></textarea>
              {errors.reason && (
                <div className="error">{errors.reason.message}</div>
              )}
            </div>
          ) : (
            ""
          )}
          <div className="btn-wrapper w-100 d-flex justify-content-end">
            <Button
              className="btn btn-primary me-2"
              type="submit"
              // onClick={() => {
              //   funHandler.fun(funHandler?.id);
              //   props.onHide();
              // }}
            >
              confirm
            </Button>
            <div
              variant="secondary"
              className="btn btn-primary me-2"
              onClick={() => props.onHide()}
            >
              Close
            </div>
          </div>
        </form>
      </Modal.Footer>
    </Modal>
  );
};
