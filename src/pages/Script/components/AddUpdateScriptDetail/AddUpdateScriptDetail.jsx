import React, { useEffect,  useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

import "./AddUpdateScriptDetail.scss";

import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useStateValue } from "../../../../StateProvider";
import { ConfirmationModal } from "../../../../components/Modals/ConfirmationModal";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebaseConfig";

const AddUpdateScriptDetail = () => {
  const [tab] = useState("information");
  const [ dispatch] = useStateValue();
  const [taskStatus] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFilter = searchParams.get("search_filter");
  const [title, setTitle] = useState("Add Pateient");

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
  // ********************************************** form start ****************************************************
  const {
    register,
    handleSubmit,
    setValue,
    // watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  // const watchedFields = watch();
  const onSubmit = async (data) => {
    console.log(data);
    dispatch({ type: "SET_LOADING", status: true });
    if (scriptId) {
      try {
        const docRef = doc(db, "pateientDetail", scriptId);
        await updateDoc(docRef, data);

        toast.success("Document updated successfully");
        navigateToScriptWithId(scriptId);
      } catch (error) {
        toast.error("Error updating document: ", error);
      }
    } else {
      try {
        const re = await addDoc(collection(db, "pateientDetail"), {
          ...data,
          userId: auth.currentUser.uid,
          timestamp: new Date(),
        });
        toast.success("Form submitted successfully!");
        navigateToScriptWithId(re.id);
      } catch (error) {
        console.error("Error saving document: ", error);
        toast.error("Error submitting the form. Please try again.");
      }
    }
    dispatch({ type: "SET_LOADING", status: false });
  };
  // ********************************************** form end ****************************************************

  // ********************************************** get data end ****************************************************
  // ********************************************** get task data start****************************************************
  const fetchscriptDetail = async () => {
    // Perform the API call to fetch company info
    try {
      dispatch({ type: "SET_LOADING", status: true });
      const docRef = doc(db, "pateientDetail", scriptId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setValue("Name", data?.Name);
      } else {
        toast.error("No such document!");
      }

      dispatch({ type: "SET_LOADING", status: false });
      // return response;
    } catch (error) {
      console.error("Error fetching data:", error); // Log any errors that occur
    }
  };
  useQuery({
    queryKey: ["script-detail"],
    queryFn: fetchscriptDetail,
    enabled: scriptId ? true : false,
    // staleTime: Infinity,
    onSuccess: (Re) => {
      console.log(Re);
    },
    onError: (e) => {
      console.log(e);
    },
  })
  // ********************************************** get task data end ****************************************************

  useEffect(() => {
    if (scriptId  === "information") {
      setTitle("Update Script");
    }
    if (!scriptId === "information") {
      setTitle("Add New Script");
    }
  }, [scriptId]);

  const [funHandler] = useState();
  const [confirmationShow, setConfirmationShow] = useState(false);
  const handleConfirmationClose = () => {
    setConfirmationShow(false);
  };

  return (
    <div id="app-content">
      {/* Container fluid */}
      <div className="app-content-area mb-10">
        <div className="container-fluid ">
          <div className=" mx-n6 mt-n6 pt-6 mb-6 header">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-12">
                {/* Page header */}
                <div
                  className="d-lg-flex
            align-items-center justify-content-between  px-6"
                >
                  {/* <div className="mb-6 mb-lg-0"> */}
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <div className="">
                      <h1 className="mb-0 h3 ">{title}</h1>
                    </div>
                    <div lassName="status ">
                      <div
                        className="mb-0"
                        style={{ fontSize: "20px", fontWeight: "bold" }}
                      >
                        {taskStatus}
                      </div>
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-12"></div>
          </div>
          <div>
            {/* row */}
            <div className="row">
              <div className="col-xl-12 col-md-12 col-12">
                {/* card */}
                {(() => {
                  switch (tab) {
                    case "information":
                      return (
                        // <form onSubmit={handleSubmit(onSubmit)}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="card mb-5">
                            {/* card body */}
                            <div className="card-body">
                              {/* form */}
                              <div className="row">
                                {/* form group */}
                                <div className="mb-4 col-md-12 col-12">
                                  <label className="form-label">
                                    Name
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="d-flex ">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter Script Name"
                                      {...register("Name", {
                                        required: "Name is required",
                                      })}
                                    />
                                  </div>
                                  {errors.Name && (
                                    <div className="error">
                                      {errors.Name.message}
                                    </div>
                                  )}
                                </div>
                                {/* form group */}
                                <div className="mb-4 col-md-12 col-12">
                                  <label className="form-label">
                                    Developer Name
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="d-flex ">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter developer name"
                                      {...register("DeveloperName", {
                                        required: "Name is required",
                                      })}
                                    />
                                  </div>
                                  {errors.DeveloperName && (
                                    <div className="error">
                                      {errors.DeveloperName.message}
                                    </div>
                                  )}
                                </div>
                                {/* form group */}
                                <div className="mb-4 col-md-6 col-12">
                                  <label className="form-label">Country</label>
                                  <div className="d-flex">
                                    <select className="form-select">
                                      <option value="">Select a country</option>
                                      <option value="USA">United States</option>
                                      <option value="Canada">Canada</option>
                                      <option value="UK">United Kingdom</option>
                                      <option value="India">India</option>
                                      <option value="Australia">
                                        Australia
                                      </option>
                                    </select>
                                  </div>
                                  {errors.Country && (
                                    <div className="error">
                                      {errors.Country.message}
                                    </div>
                                  )}
                                </div>

                                <div className="mb-4 col-md-6 col-12">
                                  <label className="form-label">Status</label>
                                  <div className="d-flex">
                                    <select className="form-select">
                                      <option value="">Select a status</option>
                                      <option value="Active">Active</option>
                                      <option value="Inactive">Inactive</option>
                                      <option value="Pending">Pending</option>
                                      <option value="Completed">
                                        Completed
                                      </option>
                                    </select>
                                  </div>
                                  {errors.Status && (
                                    <div className="error">
                                      {errors.Status.message}
                                    </div>
                                  )}
                                </div>

                                <div className="mb-4">
                                  <label className="form-label">
                                    Script File
                                  </label>
                                  <div
                                    className="border rounded p-4 text-center"
                                    style={{
                                      border: "2px dashed #ccc",
                                      backgroundColor: "#f9f9f9",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input
                                      type="file"
                                      className="form-control-file"
                                      {...register("scriptFile")}
                                    />
                                    <p className="text-muted">
                                      Drop files here to upload
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4  justify-content-center gap-4   bottom-btns-web">
                            <div className="left d-flex flex-wrap gap-3 align-items-center">
                              <div
                                className="btn btn-outline-danger "
                                style={{ height: "fit-content" }}
                                onClick={() => {
                                  if (scriptId) {
                                    navigateToScriptWithId(scriptId);
                                  } else {
                                    navigateToScript();
                                  }
                                }}
                              >
                                Cancel
                              </div>
                            </div>

                            {/* // )} */}
                            <div className="d-flex right align-items-center">
                              <button className="  btn btn-primary  ">
                                Save
                              </button>
                            </div>
                          </div>
                        </form>
                      );
                    default:
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={confirmationShow}
        onHide={handleConfirmationClose}
        funHandler={funHandler}
      />
    </div>
  );
};

export default AddUpdateScriptDetail;
