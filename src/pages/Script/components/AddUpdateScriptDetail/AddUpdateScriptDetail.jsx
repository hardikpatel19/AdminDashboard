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
  getCountry,
  getcountryDetail,
  getDeveloper,
  getDeveloperDetail,
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
  const [developerList, setDeveloperList] = useState();
  const [countryList, setCountryList] = useState();
  const [currentItems, setCurrentItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recentLogsText, setRecentLogsText] = useState("");
  const [fileName, setFileName] = useState("");
  const searchParams = new URLSearchParams(location.search);
  const searchFilter = searchParams.get("search_filter");
  const [title, setTitle] = useState("Add Script");
  const [logFilePath, setLogFilePath] = useState(null);
  const navigate = useNavigate();
  const { scriptId } = useParams();
  const { developerId } = useParams();
  // const { countryId } = useParams();
  const [logContent, setLogContent] = useState("");
  const [logResponse, setLogResponse] = useState("");

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
    watch,
  } = useForm({
    defaultValues: {},
  });
  const watchFiled = watch();
  // Form Submission
  const onSubmit = async (data) => {
    console.log(data);

    try {
      dispatch({ type: "SET_LOADING", status: true });
      if (scriptId) {
        //  data._id = scriptId;
        console.log(data);
        if (!data.file) {
          delete data.file;
        }
        delete data.bigref_no;
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
        setValue(
          "development_date",
          response?.data?.data?.development_date.split("T")[0]
        );
        setValue(
          "schedule_time",
          response?.data?.data?.schedule_time.split("T")[1].slice(0, 5)
        );
        setValue("country", response?.data?.data?.country);
        setValue("script_status", response?.data?.data?.status);
        setValue("bigref_no", response?.data?.data?.bigref_no);
        setValue("script_type", response?.data?.data?.script_type);

        // ✅ Extract and set file name from `script_file_path`
        if (response?.data?.data?.script_file_path) {
          const extractedFileName = response.data.data.script_file_path.split("/").pop();
          setFileName(extractedFileName); // ✅ Set extracted file name in state
        }

        setRecentLogsText(response?.data?.data?.recent_logs);
        if (response?.data?.data?.recent_log_file) {
          setLogFilePath(
            response?.data?.data?.recent_log_file.split("/").pop()
          );
          getLog(response?.data?.data?.recent_log_file.split("/").pop());
        }
      } else if (response?.response) {
        toast.error(response.response.data.message);
      }

      dispatch({ type: "SET_LOADING", status: false });
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const getLog = async (fileName) => {
    try {
      // Get the log file as a Blob
      const response = await downloadLog(fileName);

      if (!response || !response.data) {
        throw new Error("Failed to download file");
      }
      setLogResponse(response);
      // Use FileReader to convert Blob to text
      const reader = new FileReader();
      reader.onload = () => {
        setLogContent(reader.result); // Set the file content to the state
      };
      reader.onerror = () => {
        toast.error("Failed to read the file."); // Handle reading errors
      };

      // Read the Blob as text
      reader.readAsText(response.data);
    } catch (err) {
      toast.error("Error loading the log file."); // Handle API errors
      console.error(err);
    } finally {
      // setIsLoading(false);
    }
  };
  // downloadLogFile
  const downloadLogFile = (logContent) => {
    // Your text content for the .log file

    // Create a Blob with the log content and specify the MIME type
    const blob = new Blob([logContent], { type: "text/plain" });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an <a> element for the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${watchFiled.script_name}.log`; // Specify the file name

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up the URL after the download
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    if (recentLogsText) {
      downloadLogFile(recentLogsText);
      return;
    }
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
  const fetchDeveloperList = async (pageNumber) => {
    try {
      const response = await getDeveloper(pageNumber);
      console.log(response);

      if (response?.status === 200) {
        console.log(response?.data?.data);

        setDeveloperList(response?.data?.data?.data);
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error); // Log any errors that occur
      throw error;
    }
  };

  const { refetch } = useQuery({
    queryKey: ["developer-list", currentPage],
    queryFn: () => fetchDeveloperList(currentPage),
    onSuccess: (Re) => {
      console.log(Re);
    },
    onError: (e) => {
      console.log(e);
    },
  });

  // Fetch Data for Developer Name Edit
  const fetchdeveloperDetail = async () => {
    try {
      dispatch({ type: "SET_LOADING", status: true });
      const response = await getDeveloperDetail(developerId);
      console.log(response);

      if (response?.status === 200) {
        setValue("developer_id", response?.data?.data?.developer_id);
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


  const fetchCountryList = async (pageNumber) => {
    try {
      const response = await getCountry(pageNumber);
      console.log(response);

      if (response?.status === 201) {
        console.log(response?.data?.result?.result,"******************");

        setCountryList(response?.data?.result?.result);
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error); // Log any errors that occur
      throw error;
    }
  };
  useQuery({
    queryKey: ["country-list", currentPage],
    queryFn: () => fetchCountryList(currentPage),
    onSuccess: (Re) => {
      console.log(Re);
    },
    onError: (e) => {
      console.log(e);
    },
  });

  // Fetch Data for Developer Name Edit
  // const fetchcountryDetail = async () => {
  //   try {
  //     dispatch({ type: "SET_LOADING", status: true });
  //     const response = await getcountryDetail(countryId);
  //     console.log(response);

  //     if (response?.status === 201) {
  //       setValue("country", response?.data?.result.country);
  //     } else if (response?.response) {
  //       toast.error(response.response.data.message);
  //     }
  //     dispatch({ type: "SET_LOADING", status: false });
  //     return response;
  //   } catch (error) {
  //     console.error("Error fetching data:", error); // Log any errors that occur
  //   }
  // };

  // useQuery({
  //   queryKey: ["country-detail"],
  //   queryFn: fetchcountryDetail,
  //   enabled: countryId ? true : false,
  //   onSuccess: (Re) => console.log(Re),
  //   onError: (e) => console.error(e),
  // });

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
                        required: "Developer id is required",
                      })}
                    >
                      <option value="">Select a Developer</option>

                      {developerList &&
                        Array.isArray(developerList) &&
                        developerList.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
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
                      Schedule Time<span className="text-danger">*</span>
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      // placeholder="Select schedule tie"
                      {...register("schedule_time", {
                        required: "schedule time is required",
                      })}
                    />
                    {errors.schedule_time && (
                      <div className="error">
                        {errors.schedule_time.message}
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
                        required: "Country is required",
                      })}
                    >
                      <option value="">Select a Country</option>

                      {countryList &&
                        Array.isArray(countryList) &&
                        countryList.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Frequency<span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      {...register("frequency", {
                        required: "Frequency is required",
                      })}
                    >
                      <option value="">Select Frequency</option>
                      <option value="one_time">One Time</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi_weekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom">Customized</option>
                    </select>
                    {errors.frequency && (
                      <div className="error">{errors.frequency.message}</div>
                    )}
                  </div>

                  {/* Conditional Custom Frequency Options */}
                  {watch("frequency") === "custom" && (
                    <div className="mb-4 col-md-6">
                      <label className="form-label">Custom Schedule</label>
                      <div className="d-flex flex-wrap">
                        <label className="me-3">
                          <input
                            type="checkbox"
                            {...register("custom_days")}
                            value="twice_week"
                          />
                          Twice a Week
                        </label>
                        <label className="me-3">
                          <input
                            type="checkbox"
                            {...register("custom_days")}
                            value="thrice_week"
                          />
                          Thrice a Week
                        </label>
                        <label className="me-3">
                          <input
                            type="checkbox"
                            {...register("custom_days")}
                            value="once_week"
                          />
                          Once a Week
                        </label>
                      </div>
                    </div>
                  )}
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
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Script File</label>
                    <input
                      type="file"
                      id="fileInput"
                      className="form-control"
                      {...register("file", {
      required: scriptId ? false : "Please upload a script file.",
                      })}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFileName(file.name); // ✅ Show newly selected file name
                          setValue("file", file); // ✅ Update React Hook Form
                        }
                      }}
                    />
                    {fileName && (
                      <p className="mt-2">
                        Selected File: <strong>{fileName}</strong>
                      </p>
                    )}
  {errors.file && <p className="text-danger">{errors.file.message}</p>}
                  </div>

                  <div className="mb-4 col-md-6">
                    <label className="form-label">Big Ref No</label>
                    <textarea
                      type="number"
                      className="form-control"
                      placeholder="Enter address"
                      {...register("bigref_no")}
                      value={"[]"}
                      disabled
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
                  {(logFilePath || recentLogsText) && (
                    <>
                      <div className="mb-4 col-md-12">
                        <label className="form-label">Recent Log</label>
                        <textarea
                          type="number"
                          rows={10}
                          className="form-control"
                          placeholder="Enter address"
                          value={logContent ? logContent : recentLogsText}
                        />
                      </div>
                      <div className="mb-4 col-md-6">
                        {/* <label className="form-label me-3">Recent Log</label> */}
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
                    </>
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
