import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useStateValue } from "../../../../StateProvider";
import { ConfirmationModal } from "../../../../components/Modals/ConfirmationModal";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  addScriptDetail,
  downloadLog,
  getScriptDetail,
  updateScriptDetail,
} from "../../../../apiCall";

// Firebase Storage
const storage = getStorage();

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

const AddUpdateScriptDetail = () => {
  // const [tab] = useState("information");
  const [, dispatch] = useStateValue();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFilter = searchParams.get("search_filter");
  const [title, setTitle] = useState("Add Script");
  const [logFilePath, setLogFilePath] = useState(null);
  const navigate = useNavigate();
  const { scriptId } = useParams();

  const navigateToScriptWithId = (Id) => {
    if (searchFilter) {
      navigate(`/script?script_id=${Id}&search_filter=${searchFilter}`);
    } else {
      navigate(`/script?scriptt_id=${Id}`);
    }
  };

  const navigateToScript = () => {
    if (searchFilter) {
      navigate(`/script?search_filter=${searchFilter}`);
    } else {
      navigate(`/script`);
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
    console.log(data);

    try {
      dispatch({ type: "SET_LOADING", status: true });
      if (scriptId) {
        //  data._id = scriptId;
        const response = await updateScriptDetail(data, scriptId);
        console.log(response);
        if (response?.status === 200) {
          toast.success(response.data.message);
          navigate("/script");
        } else {
          toast.error(response.response.data.message);
        }
      } else {
        dispatch({ type: "SET_LOADING", status: true });
        const response = await addScriptDetail(data);
        console.log(response);
        if (response?.status === 201) {
          toast.success(response.data.message);
          navigate("/script");
        } else {
          toast.error(response.response.data.message);
        }
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Error submitting the form. Please try again.");
    }

    dispatch({ type: "SET_LOADING", status: false });
  };
  // Fetch Data for Edit
  const fetchscriptDetail = async () => {
    try {
      dispatch({ type: "SET_LOADING", status: true });
      const response = await getScriptDetail(scriptId);
      console.log(response);

      if (response?.status === 200) {
        setValue("script_name", response?.data?.data?.script_name);
        setValue("developer_id", response?.data?.data?.developer_id);
        setValue("development_date", response?.data?.data?.development_date);
        setValue("country", response?.data?.data?.country);
        setValue("script_status", response?.data?.data?.script_status);
        setValue("bigref_no", response?.data?.data?.bigref_no);
        setValue("script_type", response?.data?.data?.script_type);
        setValue("file", response?.data?.data?.file);
        setLogFilePath(response?.data?.data?.recent_log_file.split("/").pop());
      } else if (response?.response) {
        toast.error(response.response.data.message);
      }

      dispatch({ type: "SET_LOADING", status: false });
      return response;
    } catch (error) {
      console.error("Error fetching data:", error); // Log any errors that occur
    }
  };

  // downloadLogFile
  const handleDownload = async () => {
    try {
      const response = await downloadLog(logFilePath);
      
      // Check if the response is valid
      if (!response || !response.data) {
        throw new Error("Failed to download file");
      }

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = logFilePath; // Set the downloaded filename
      document.body.appendChild(a); // Append the <a> element to the DOM
      a.click(); // Trigger the download
      a.remove(); // Remove the <a> element from the DOM
      window.URL.revokeObjectURL(url); // Clean up the Blob URL

    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  useQuery({
    queryKey: ["script-detail"],
    queryFn: fetchscriptDetail,
    enabled: scriptId ? true : false,
    onSuccess: (Re) => console.log(Re),
    onError: (e) => console.error(e),
  });

  useEffect(() => {
    if (scriptId) {
      setTitle("Update Script");
    } else {
      setTitle("Add New Script");
    }
  }, [scriptId]);

  const [confirmationShow, setConfirmationShow] = useState(false);
  const handleConfirmationClose = () => setConfirmationShow(false);

  return (
    <div id="app-content">
      <div className="app-content-area mb-10">
        <div className="container-fluid">
          <div className="header px-1">
            <h1 className="mb-4 h3">{title}</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card mb-5">
              <div className="card-body">
                <div className="row">
                  <div className="mb-4 col-md-12">
                    <label className="form-label">
                      Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Script Name"
                      {...register("script_name", {
                        required: "Name is required",
                      })}
                    />
                    {errors.script_name && (
                      <div className="error">{errors.script_name.message}</div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Developer Name<span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      {...register("developer_id", {
                        required: "country is required",
                      })}
                    >
                      <option value="">Select a Developer</option>
                      <option value="678ba1ae2fc1b3fd32e5a904">
                        678ba1ae2fc1b3fd32e5a904
                      </option>
                    </select>
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Development Date<span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Select development date"
                      {...register("development_date", {
                        required: "Development Date is required",
                      })}
                    />
                    {errors.development_date && (
                      <div className="error">
                        {errors.development_date.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Country<span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      {...register("country", {
                        required: "country is required",
                      })}
                    >
                      <option value="">Select a country</option>
                      <option value="USA">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="India">India</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Status<span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      {...register("script_status", {
                        required: "Status is required",
                      })}
                    >
                      <option value="">Select a status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Script File</label>
                    <input
                      type="file"
                      id="fileInput"
                      className="form-control"
                      {...register("file", {
                        required: "Please upload a script file.", // Validation rule
                      })}
                    />
                    {errors.file && (
                      <p className="text-danger">{errors.file.message}</p>
                    )}
                  </div>

                  <div className="mb-4 col-md-6">
                    <label className="form-label">Big Ref No</label>
                    <textarea
                      type="number"
                      className="form-control"
                      placeholder="Enter address"
                      {...register("bigref_no")}
                    />
                    {errors.bigref_no && (
                      <div className="error">{errors.bigref_no.message}</div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Script Type<span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      {...register("script_type", {
                        required: "Script Type is required",
                      })}
                    >
                      <option value="">Select a status</option>
                      <option value="Tender">Tender</option>
                      <option value="Project">Project</option>
                      <option value="Grant">Grant</option>
                      <option value="Contract Award">Contract Award</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {logFilePath && (
                    <div className="mb-4 col-md-6">
                      <label className="form-label me-3">Recent Log</label>
                      <div
                        type="download"
                        onClick={() => handleDownload()}
                        className="btn btn-primary px-4"
                      >
                        Download Log
                      </div>
                      {/* {errors.BigRefNo && (
                      <div className="error">
                        {errors.BigRefNo.message}
                      </div>
                    )} */}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => navigateToScript()}
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

export default AddUpdateScriptDetail;
