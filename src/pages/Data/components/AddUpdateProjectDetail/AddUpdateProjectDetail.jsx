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

const AddUpdateProjectDetail = () => {
  const [, dispatch] = useStateValue();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFilter = searchParams.get("search_filter");
  const [title, setTitle] = useState("Add Project");

  const navigate = useNavigate();
  const { projectId } = useParams();

  const navigateToProjectWithId = (Id) => {
    if (searchFilter) {
      navigate(`/project?project_id=${Id}&search_filter=${searchFilter}`);
    } else {
      navigate(`/project?projectt_id=${Id}`);
    }
  };

  const navigateToProject = () => {
    if (searchFilter) {
      navigate(`/project?search_filter=${searchFilter}`);
    } else {
      navigate(`/project`);
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

      if (data.projectFile && data.projectFile[0]) {
        fileUrl = await uploadFileToStorage(data.projectFile[0]);
      }

      const documentData = {
        ...data,
        projectFile: fileUrl,
        userId: auth.currentUser.uid,
        timestamp: new Date(),
      };

      if (projectId) {
        const docRef = doc(db, "projectDetail", projectId);
        await updateDoc(docRef, documentData);
        toast.success("Document updated successfully");
        navigateToProjectWithId(projectId);
      } else {
        const docRef = await addDoc(
          collection(db, "projectDetail"),
          documentData
        );
        toast.success("Form submitted successfully!");
        navigateToProjectWithId(docRef.id);
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Error submitting the form. Please try again.");
    }

    dispatch({ type: "SET_LOADING", status: false });
  };

  // Fetch Data for Edit
  const fetchprojectDetail = async () => {
    try {
      dispatch({ type: "SET_LOADING", status: true });
      const docRef = doc(db, "projectDetail", projectId);
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
    queryKey: ["project-detail"],
    queryFn: fetchprojectDetail,
    enabled: !!projectId,
    onSuccess: (Re) => console.log(Re),
    onError: (e) => console.error(e),
  });

  useEffect(() => {
    if (projectId) {
      setTitle("Update Project");
    } else {
      setTitle("Add Project");
    }
  }, [projectId]);

  const [confirmationShow, setConfirmationShow] = useState(false);
  const handleConfirmationClose = () => setConfirmationShow(false);

  return (
    <div id="app-content">
      <div className="app-content-area mb-10">
        <div className="container-fluid">
          <div className="header px-6">
            <h1 className="mb-0 h3">{title}</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card mb-5">
              <div className="card-body">
                <div className="row">
                  <div className="mb-4 col-md-4">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="title"
                      {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && (
                      <div className="error">{errors.title.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">
                      Project Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="project_name"
                      {...register("Name", { required: "Name is required" })}
                    />
                    {errors.Name && (
                      <div className="error">{errors.Name.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Project Background</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="project_background"
                      {...register("project_background")}
                    />
                    {errors.project_background && (
                      <div className="error">{errors.project_background.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Project Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="project_location"
                      {...register("project_location")}
                    />
                    {errors.project_location && (
                      <div className="error">{errors.project_location.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Project Status</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="projet_status"
                      {...register("Status")}
                    />
                    {errors.Status && (
                      <div className="error">{errors.Status.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Publishing Date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Select publishing date"
                      {...register("project_publishing_date")}
                    />
                    {errors.project_publishing_date && (
                      <div className="error">{errors.project_publishing_date.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">
                      Estimate Completion Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Select closing date"
                      {...register("estimated_project_completion_date")}
                    />
                    {errors.estimated_project_completion_date && (
                      <div className="error">
                        {errors.estimated_project_completion_date.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">
                      Big Ref Number<span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="big_ref_no"
                      {...register("big_ref_no", {
                        required: "Number is required",
                      })}
                    />
                    {errors.big_ref_no && (
                      <div className="error">{errors.big_ref_no.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Client Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="client_name"
                      {...register("ClientName")}
                    />
                    {errors.ClientName && (
                      <div className="error">{errors.ClientName.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Client Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="client_address"
                      {...register("ClientAddress")}
                    />
                    {errors.ClientAddress && (
                      <div className="error">
                        {errors.ClientAddress.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Sector</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="input here"
                      {...register("sectors")}
                    />
                    {errors.sectors && (
                      <div className="error">{errors.sectors.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Region</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="input here"
                      {...register("regions")}
                    />
                    {errors.regions && (
                      <div className="error">{errors.regions.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">CPV Code</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="input here"
                      {...register("cpv_codes")}
                    />
                    {errors.cpv_codes && (
                      <div className="error">{errors.cpv_codes.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Funding Agency</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="input here"
                      {...register("FundingAgency")}
                    />
                    {errors.FundingAgency && (
                      <div className="error">
                        {errors.FundingAgency.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => navigateToProject()}
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

export default AddUpdateProjectDetail;
