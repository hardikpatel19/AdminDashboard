import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useStateValue } from "../../../../StateProvider";
import { ConfirmationModal } from "../../../../components/Modals/ConfirmationModal";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const [title, setTitle] = useState("Add Patient");

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
    dispatch({ type: "SET_LOADING", status: true });

    try {
      let fileUrl = null;

      if (data.scriptFile && data.scriptFile[0]) {
        fileUrl = await uploadFileToStorage(data.scriptFile[0]);
      }

      const documentData = {
        ...data,
        scriptFile: fileUrl,
        userId: auth.currentUser.uid,
        timestamp: new Date(),
      };

      if (scriptId) {
        const docRef = doc(db, "scriptDetail", scriptId);
        await updateDoc(docRef, documentData);
        toast.success("Document updated successfully");
        navigateToScriptWithId(scriptId);
      } else {
        const docRef = await addDoc(
          collection(db, "scriptDetail"),
          documentData
        );
        toast.success("Form submitted successfully!");
        navigateToScriptWithId(docRef.id);
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
      const docRef = doc(db, "scriptDetail", scriptId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setValue("Name", data?.Name);
        setValue("DeveloperName", data?.DeveloperName);
        setValue("Country", data?.Country);
        setValue("Status", data?.Status);
      } else {
        toast.error("No such document!");
      }
      dispatch({ type: "SET_LOADING", status: false });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useQuery({
    queryKey: ["script-detail"],
    queryFn: fetchscriptDetail,
    enabled: !!scriptId,
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
                      {...register("Name", { required: "Name is required" })}
                    />
                    {errors.Name && (
                      <div className="error">{errors.Name.message}</div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Developer Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter developer name"
                      {...register("DeveloperName", {
                        required: "Developer Name is required",
                      })}
                    />
                    {errors.DeveloperName && (
                      <div className="error">
                        {errors.DeveloperName.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">
                      Development Date<span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Select development date"
                      {...register("DevelopmentDate", {
                        required: "Development Date is required",
                      })}
                    />
                    {errors.DevelopmentDate && (
                      <div className="error">
                        {errors.DevelopmentDate.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Country</label>
                    <select className="form-select" {...register("Country")}>
                      <option value="">Select a country</option>
                      <option value="USA">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="India">India</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Status</label>
                    <select className="form-select" {...register("Status")}>
                      <option value="">Select a status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Script File</label>
                    <input
                      type="file"
                      className="form-control"
                      {...register("scriptFile")}
                    />
                  </div>

                  <div className="mb-4 col-md-12">
                    <label className="form-label">
                      Big Ref No
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter address"
                      {...register("BigRefNo")}
                    />
                    {errors.BigRefNo && (
                      <div className="error">
                        {errors.BigRefNo.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label me-3">
                      Recent Log
                    </label>
                    <button type="download" className="btn btn-primary px-4">
                Download Log
              </button>
                    {/* {errors.BigRefNo && (
                      <div className="error">
                        {errors.BigRefNo.message}
                      </div>
                    )} */}
                  </div>
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
