import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useStateValue } from "../../../../../../StateProvider";
import { ConfirmationModal } from "../../../../../../components/Modals/ConfirmationModal";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addProjectDetail, getProjectDetail, updateProjectDetail } from "../../../../../../apiCall";
import { toast } from "react-toastify";

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
      navigate(`/projectData`);
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
        if (projectId) {
          data._id = projectId;
          const response = await updateProjectDetail(data);
          console.log(response);
          if (response?.status === 201) {
            toast.success(response.data.message);
            navigate("/projectData");
          }
          else{
            toast.error(response.response.data.message);
  
          }
        } else {
          
          const response = await addProjectDetail(data);
          console.log(response);
          if (response?.status === 201) {
            toast.success(response.data.message);
            navigate("/projectData");
          }
          else{
            toast.error(response.response.data.message);
  
          }
        }
      } catch (error) {
        console.error("Error saving document:", error);
        toast.error("Error submitting the form. Please try again.");
      }
  
      dispatch({ type: "SET_LOADING", status: false });
    };
  
    // ************************************************* Fetch Data for Edit *******************************************
    const fetchprojectDetail = async () => {
      try {
        dispatch({ type: "SET_LOADING", status: true });
        const response = await getProjectDetail(projectId);
        console.log(response);
  
        if (response?.status === 201) {
          setValue("title", response?.data?.result?.title);
          setValue("project_background", response?.data?.result?.project_background);
          setValue("project_name", response?.data?.result?.project_name);
          setValue("project_location", response?.data?.result?.project_location);
          setValue("projet_status", response?.data?.result?.projet_status);
          setValue("project_publishing_date", response?.data?.result?.project_publishing_date);
          setValue("estimated_project_completion_date", response?.data?.result?.estimated_project_completion_date);
          setValue("big_ref_no", response?.data?.result?.big_ref_no);
          setValue("client_name", response?.data?.result?.client_name);
          setValue("client_address", response?.data?.result?.client_address);
          setValue("sectors", response?.data?.result?.sectors);
          setValue("regions", response?.data?.result?.regions);
          setValue("cpv_codes", response?.data?.result?.cpv_codes);
          setValue("funding_agency", response?.data?.result?.funding_agency);
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
    queryKey: ["project-detail"],
    queryFn: fetchprojectDetail,
    enabled: projectId? true : false,
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
          <div className="header px-1">
            <h1 className="mb-4 h3">{title}</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card mb-5">
              <div className="card-body">
                <div className="row">
                  <div className="mb-4 col-md-4">
                    <label className="form-label">
                      Title<span className="text-danger">*</span>
                    </label>
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
                      {...register("project_name", { required: "project_name is required" })}
                    />
                    {errors.project_name && (
                      <div className="error">{errors.project_name.message}</div>
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
                      <div className="error">
                        {errors.project_background.message}
                      </div>
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
                      <div className="error">
                        {errors.project_location.message}
                      </div>
                    )}
                  </div>

                  {/* <div className="mb-4 col-md-4">
                    <label className="form-label">Project Status</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="projet_status"
                      {...register("projet_status")}
                    />
                    {errors.projet_status && (
                      <div className="error">{errors.projet_status.message}</div>
                    )}
                  </div> */}

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Publishing Date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Select publishing date"
                      {...register("project_publishing_date")}
                    />
                    {errors.project_publishing_date && (
                      <div className="error">
                        {errors.project_publishing_date.message}
                      </div>
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
                      type="text"
                      className="form-control"
                      placeholder="big_ref_no"
                      {...register("big_ref_no", {
                        required: "Big Ref Number is required",
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
                      {...register("client_name")}
                    />
                    {errors.client_name && (
                      <div className="error">{errors.client_name.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Client Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="client_address"
                      {...register("client_address")}
                    />
                    {errors.client_address && (
                      <div className="error">
                        {errors.client_address.message}
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
                      {...register("funding_agency")}
                    />
                    {errors.funding_agency && (
                      <div className="error">
                        {errors.funding_agency.message}
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
