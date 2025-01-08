import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useStateValue } from "../../../../../../StateProvider";
import { ConfirmationModal } from "../../../../../../components/Modals/ConfirmationModal";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addGrantsDetail, getGrantsDetail, updateGrantsDetail } from "../../../../../../apiCall";

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

const AddUpdateGrantsDetail = () => {
  const [, dispatch] = useStateValue();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFilter = searchParams.get("search_filter");
  const [title, setTitle] = useState("Add Grants");

  const navigate = useNavigate();
  const { grantsId } = useParams();

  const navigateToGrantsWithId = (Id) => {
    if (searchFilter) {
      navigate(`/grants?grants_id=${Id}&search_filter=${searchFilter}`);
    } else {
      navigate(`/grants?grantst_id=${Id}`);
    }
  };

  const navigateToGrants = () => {
    if (searchFilter) {
      navigate(`/grants?search_filter=${searchFilter}`);
    } else {
      navigate(`/grantsData`);
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
          if (grantsId) {
            data._id = grantsId;
            const response = await updateGrantsDetail(data);
            console.log(response);
            if (response?.status === 201) {
              toast.success(response.data.message);
              navigate("/grantsData");
            }
            else{
              toast.error(response.response.data.message);
    
            }
          } else {
            
            const response = await addGrantsDetail(data);
            console.log(response);
            if (response?.status === 201) {
              toast.success(response.data.message);
              navigate("/grantsData");
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
      const fetchgrantsDetail = async () => {
        try {
          dispatch({ type: "SET_LOADING", status: true });
          const response = await getGrantsDetail(grantsId);
          console.log(response);
    
          if (response?.status === 201) {
            setValue("donor", response?.data?.result?.donor);
            setValue("contact_information", response?.data?.result?.contact_information);
            setValue("location", response?.data?.result?.location);
            setValue("big_ref_no", response?.data?.result?.big_ref_no);
            setValue("title", response?.data?.result?.title);
            setValue("type", response?.data?.result?.type);
            setValue("status", response?.data?.result?.status);
            setValue("value", response?.data?.result?.value);
            setValue("type_of_services", response?.data?.result?.type_of_services);
            setValue("sectors", response?.data?.result?.sectors);
            setValue("deadline", response?.data?.result?.deadline);
            setValue("duration", response?.data?.result?.duration);
            setValue("cpv_codes", response?.data?.result?.cpv_codes);
            setValue("funding_agency", response?.data?.result?.funding_agency);
            setValue("regions", response?.data?.result?.regions);
            setValue("attachment", response?.data?.result?.attachment);
            setValue("post_date", response?.data?.result?.post_date);
            // setValue("project_background", response?.data?.result?.project_background);
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
    queryKey: ["grants-detail"],
    queryFn: fetchgrantsDetail,
    enabled: grantsId? true : false,
    onSuccess: (Re) => console.log(Re),
    onError: (e) => console.error(e),
  });

  useEffect(() => {
    if (grantsId) {
      setTitle("Update Grants");
    } else {
      setTitle("Add Grants");
    }
  }, [grantsId]);

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
                      Donor<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="donor"
                      {...register("donor", { required: "Donor is required" })}
                    />
                    {errors.donor && (
                      <div className="error">{errors.donor.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Contact Information</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="contact_information"
                      {...register("contact_information")}
                    />
                    {errors.contact_information && (
                      <div className="error">
                        {errors.contact_information.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="location"
                      {...register("location")}
                    />
                    {errors.location && (
                      <div className="error">{errors.location.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Big Ref Number</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="big_ref_no"
                      {...register("big_ref_no")}
                    />
                    {errors.big_ref_no && (
                      <div className="error">{errors.big_ref_no.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="title"
                      {...register("title")}
                    />
                    {errors.title && (
                      <div className="error">{errors.title.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Type</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="type"
                      {...register("type")}
                    />
                    {errors.type && (
                      <div className="error">{errors.type.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Status</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="status"
                      {...register("status")}
                    />
                    {errors.status && (
                      <div className="error">{errors.status.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Value</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="value"
                      {...register("value")}
                    />
                    {errors.value && (
                      <div className="error">{errors.value.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Type Of Services</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="type_of_services"
                      {...register("type_of_services")}
                    />
                    {errors.type_of_services && (
                      <div className="error">
                        {errors.type_of_services.message}
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
                    <label className="form-label">Deadline</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="deadline"
                      {...register("deadline")}
                    />
                    {errors.deadline && (
                      <div className="error">{errors.deadline.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Duration</label>
                    <input
                      type="Number"
                      className="form-control"
                      placeholder="duration"
                      {...register("duration")}
                    />
                    {errors.duration && (
                      <div className="error">{errors.duration.message}</div>
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
                    <label className="form-label">Attachment</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="attachment"
                      {...register("attachment")}
                    />
                    {errors.attachment && (
                      <div className="error">{errors.attachment.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Post Date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Select post date"
                      {...register("post_date")}
                    />
                    {errors.post_date && (
                      <div className="error">{errors.post_date.message}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => navigateToGrants()}
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

export default AddUpdateGrantsDetail;
