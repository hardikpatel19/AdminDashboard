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

const AddUpdateDeveloperdetail = () => {
  const [, dispatch] = useStateValue();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFilter = searchParams.get("search_filter");
  const [title, setTitle] = useState("Add Patient");

  const navigate = useNavigate();
  const { developerId } = useParams();

  const navigateToDeveloperWithId = (Id) => {
    if (searchFilter) {
      navigate(`/developer?developer_id=${Id}&search_filter=${searchFilter}`);
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
    console.log(data);
    dispatch({ type: "SET_LOADING", status: true });

    try {
      let fileUrl = null;

      if (data.developerFile && data.developerFile[0]) {
        fileUrl = await uploadFileToStorage(data.developerFile[0]);
      }

      const documentData = {
        ...data,
        developerFile: fileUrl,
        userId: auth.currentUser.uid,
        timestamp: new Date(),
      };

      if (developerId) {
        const docRef = doc(db, "developerDetail", developerId);
        await updateDoc(docRef, documentData);
        toast.success("Document updated successfully");
        navigateToDeveloperWithId(developerId);
      } else {
        const docRef = await addDoc(
          collection(db, "developerDetail"),
          documentData
        );
        toast.success("Form submitted successfully!");
        navigateToDeveloperWithId(docRef.id);
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
      const docRef = doc(db, "developerDetail", developerId);
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
    queryKey: ["developer-detail"],
    queryFn: fetchdeveloperDetail,
    enabled: !!developerId,
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
                      {...register("Name", { required: "Name is required" })}
                    />
                    {errors.Name && (
                      <div className="error">{errors.Name.message}</div>
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
                      {...register("CreateDate", {
                        required: "Development Date is required",
                      })}
                    />
                    {errors.CreateDate && (
                      <div className="error">
                        {errors.CreateDate.message}
                      </div>
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
                      {...register("Email", { required: "Email is required" })}
                    />
                    {errors.Email && (
                      <div className="error">{errors.Email.message}</div>
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
                      {...register("mobile", {
                        required: "Mobile is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Invalid mobile number.",
                        },
                      })}
                    />
                    {errors.mobile && (
                      <div className="error">{errors.mobile.message}</div>
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
                      Script Count
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter script count"
                      {...register("ScriptCount")}
                    />
                    {errors.ScriptCount && (
                      <div className="error">{errors.ScriptCount.message}</div>
                    )}
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
