import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useStateValue } from "../../../../StateProvider";
import { ConfirmationModal } from "../../../../components/Modals/ConfirmationModal";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  addDeveloperDetail,
  getDeveloperDetail,
  updateDeveloperDetail,
} from "../../../../apiCall";

// Firebase Storage
const storage = getStorage();
const formatDate = (dateString) => dateString.split("T")[0]; 
const uploadFileToStorage = async (file) => {
  if (!file) return null;

  try {
    const fileRef = ref(storage, `uploads/${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to storage:", error);
    throw error;
  }
};

const AddUpdateDeveloperdetail = () => {
  const [, dispatch] = useStateValue();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFilter = searchParams.get("search_filter");
  const [title, setTitle] = useState("Add Developer");

  const navigate = useNavigate();
  const { developerId } = useParams();

  const navigateToDeveloperWithId = (Id) => {
    if (searchFilter) {
      navigate(`/developer?developer_id=${Id}`);
    } else {
      navigate(`/developer?developer_id=${Id}`);
    }
  };

  const navigateToDeveloper = () => {
    if (searchFilter) {
      navigate(`/developer?search_filter=${searchFilter}`);
    } else {
      navigate(`/developer`);
    }
  };

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  // Form Submission
  const onSubmit = async (data) => {
    try {
      console.log(data);
      dispatch({ type: "SET_LOADING", status: true });
      if (developerId) {
        // data.id = developerId;
        const response = await updateDeveloperDetail(data,developerId);
        console.log(response, "##############");
        if (response?.status === 200) {
          toast.success(response.data.message);
          navigate("/developer");
        } else {
          toast.error(response.response.data.message);
        }
      } else {
        dispatch({ type: "SET_LOADING", status: true });
        const response = await addDeveloperDetail(data);
        console.log(response);
        if (response?.status === 201) {
          toast.success(response?.data?.message);
          navigate("/developer");
        } else {
          toast.error(response?.response?.data?.message);
        }
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Error submitting the form. Please try again.");
    }

    dispatch({ type: "SET_LOADING", status: false });
  };

  // Fetch Data for Edit
  const fetchdeveloperDetail = async () => {
    try {
      dispatch({ type: "SET_LOADING", status: true });
      const response = await getDeveloperDetail(developerId);
      console.log(response);

      if (response?.status === 200) {
        setValue("name", response?.data?.data?.name);
        setValue("joining_date", formatDate(response?.data?.data?.joining_date));
        setValue("email", response?.data?.data?.email);
        setValue("phone_number", response?.data?.data?.phone_number);
        setValue("address", response?.data?.data?.address);
        setValue(
          "total_script_count",
          response?.data?.data?.total_script_count
        );
        setValue(
          "active_script_count",
          response?.data?.data?.active_script_count
        );
        setValue(
          "maintain_script_count",
          response?.data?.data?.maintain_script_count
        );
        setValue("status", response?.data?.data?.status);
      } else if (response?.response) {
        toast.error(response.response.data.message);
      }

      dispatch({ type: "SET_LOADING", status: false });
      return response;
    } catch (error) {
      console.error("Error fetching data:", error); // Log any errors that occur
    }
  };

  useQuery({
    queryKey: ["developer-detail"],
    queryFn: fetchdeveloperDetail,
    enabled: developerId ? true : false,
    onSuccess: (Re) => console.log(Re),
    onError: (e) => console.error(e),
  });

  useEffect(() => {
    if (developerId) {
      setTitle("Update developer");
    } else {
      setTitle("Add New developer");
    }
  }, [developerId]);

  const [confirmationShow, setConfirmationShow] = useState(false);
  const handleConfirmationClose = () => setConfirmationShow(false);

  return (
    <div id="app-content">
      <div className="app-content-area mb-10">
        <div className="container-fluid">
          <div className="header px-2">
            <h1 className="mb-5 h3">{title}</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card mb-5">
              <div className="card-body">
                <div className="row">
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Script Name"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <div className="error">{errors.name.message}</div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Joining Date<span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Select joining date"
                      {...register("joining_date", {
                        required: "Joining Date is required",
                      })}
                    />
                    {errors.joining_date && (
                      <div className="error">{errors.joining_date.message}</div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Email<span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <div className="error">{errors.email.message}</div>
                    )}
                  </div>
                  {/* form group */}
                  <div className="mb-4 col-md-6 col-12">
                    <label className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="Enter mobile number"
                      {...register("phone_number", {
                        required: "Mobile is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Invalid mobile number.",
                        },
                      })}
                    />
                    {errors.phone_number && (
                      <div className="error">{errors.phone_number.message}</div>
                    )}
                  </div>
                  {/* form group */}
                  <div className="mb-4 col-md-12 col-12">
                    <label className="form-label">
                      Address
                      <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex ">
                      <textarea
                        type="text"
                        className="form-control"
                        placeholder="Enter address"
                        rows={3}
                        {...register("address", {
                          required: "Address is required",
                        })}
                      />
                    </div>
                    {errors.address && (
                      <div className="error">{errors.address.message}</div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Total Script Count<span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter script count"
                      {...register("total_script_count", {
                        required: "Total script is required",
                      })}
                    />
                    {errors.total_script_count && (
                      <div className="error">
                        {errors.total_script_count.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Active Script Count<span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter script count"
                      {...register("active_script_count", {
                        required: "Active script is required",
                      })}
                    />
                    {errors.active_script_count && (
                      <div className="error">
                        {errors.active_script_count.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Maintain Script Count
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter script count"
                      {...register("maintain_script_count", {
                        required: "Maintain script is required",
                      })}
                    />
                    {errors.maintain_script_count && (
                      <div className="error">
                        {errors.maintain_script_count.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Status<span className="text-danger">*</span>
                    </label>
                    <select className="form-select" {...register("status")}>
                      <option value="">Select a status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => navigateToDeveloper()}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmationModal
        show={confirmationShow}
        onHide={handleConfirmationClose}
      />
    </div>
  );
};

export default AddUpdateDeveloperdetail;
