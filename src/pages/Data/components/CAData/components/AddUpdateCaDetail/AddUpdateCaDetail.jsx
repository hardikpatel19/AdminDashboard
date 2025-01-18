import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useStateValue } from "../../../../../../StateProvider";
import { ConfirmationModal } from "../../../../../../components/Modals/ConfirmationModal";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addCaDetail, getCaDetail, updateCaDetail } from "../../../../../../apiCall";

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

const AddUpdateCaDetail = () => {
  const [, dispatch] = useStateValue();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFilter = searchParams.get("search_filter");
  const [title, setTitle] = useState("Add Ca");

  const navigate = useNavigate();
  const { caId } = useParams();

  const navigateToCaWithId = (Id) => {
    if (searchFilter) {
      navigate(`/ca?ca_id=${Id}&search_filter=${searchFilter}`);
    } else {
      navigate(`/ca?cat_id=${Id}`);
    }
  };

  const navigateToCa = () => {
    if (searchFilter) {
      navigate(`/ca?search_filter=${searchFilter}`);
    } else {
      navigate(`/caData`);
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
          if (caId) {
            data._id = caId;
            const response = await updateCaDetail(data);
            console.log(response);
            if (response?.status === 201) {
              toast.success(response.data.message);
              navigate("/caData");
            }
            else{
              toast.error(response.response.data.message);
    
            }
          } else {
            
            const response = await addCaDetail(data);
            console.log(response);
            if (response?.status === 201) {
              toast.success(response.data.message);
              navigate("/caData");
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
      const fetchcaDetail = async () => {
        try {
          dispatch({ type: "SET_LOADING", status: true });
          const response = await getCaDetail(caId);
          console.log(response);
    
          if (response?.status === 201) {
            setValue("title", response?.data?.result?.title);
            setValue("org_name", response?.data?.result?.org_name);
            setValue("org_address", response?.data?.result?.org_address);
            setValue("telephone_no", response?.data?.result?.telephone_no);
            setValue("fax_number", response?.data?.result?.fax_number);
            setValue("email", response?.data?.result?.email);
            setValue("contact_person", response?.data?.result?.contact_person);
            setValue("big_ref_no", response?.data?.result?.big_ref_no);
            setValue("document_no", response?.data?.result?.document_no);
            setValue("bidding_type", response?.data?.result?.bidding_type);
            setValue("project_location", response?.data?.result?.project_location);
            setValue("contractor_details", response?.data?.result?.contractor_details);
            setValue("tender_notice_no", response?.data?.result?.tender_notice_no);
            setValue("description", response?.data?.result?.description);
            setValue("awards_publish_date", response?.data?.result?.awards_publish_date);
            setValue("cpv_codes", response?.data?.result?.cpv_codes);
            setValue("sectors", response?.data?.result?.sectors);
            setValue("funding_agency", response?.data?.result?.funding_agency);
            setValue("regions", response?.data?.result?.regions);
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
    queryKey: ["ca-detail"],
    queryFn: fetchcaDetail,
    enabled: caId? true : false,
    onSuccess: (Re) => console.log(Re),
    onError: (e) => console.error(e),
  });

  useEffect(() => {
    if (caId) {
      setTitle("Update Ca");
    } else {
      setTitle("Add Ca");
    }
  }, [caId]);

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
                      Organisation Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="org_name"
                      {...register("org_name", { required: "org_name is required" })}
                    />
                    {errors.org_name && (
                      <div className="error">{errors.org_name.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Organisation Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="org_address"
                      {...register("org_address")}
                    />
                    {errors.org_address && (
                      <div className="error">{errors.org_address.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Phone</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="telephone_no"
                      {...register("telephone_no")}
                    />
                    {errors.telephone_no && (
                      <div className="error">{errors.telephone_no.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Fax Number</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="fax_number"
                      {...register("fax_number")}
                    />
                    {errors.fax_number && (
                      <div className="error">{errors.fax_number.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <div className="error">{errors.email.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Contact Person</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="contact_person"
                      {...register("contact_person")}
                    />
                    {errors.contact_person && (
                      <div className="error">
                        {errors.contact_person.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Big Ref Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="big_ref_no"
                      {...register("big_ref_no")}
                    />
                    {errors.big_ref_no && (
                      <div className="error">{errors.big_ref_no.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Document Number</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="document_no"
                      {...register("document_no")}
                    />
                    {errors.document_no && (
                      <div className="error">{errors.document_no.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Bidding Type</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="bidding_type"
                      {...register("bidding_type")}
                    />
                    {errors.bidding_type && (
                      <div className="error">{errors.bidding_type.message}</div>
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

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Contract Details</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="contract_details"
                      {...register("contractor_details")}
                    />
                    {errors.contractor_details && (
                      <div className="error">
                        {errors.contractor_details.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Tender Notice Number</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="tender_notice_no"
                      {...register("tender_notice_no")}
                    />
                    {errors.tender_notice_no && (
                      <div className="error">
                        {errors.tender_notice_no.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="description"
                      {...register("description")}
                    />
                    {errors.description && (
                      <div className="error">{errors.description.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Publish Date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Select publish date"
                      {...register("awards_publish_date")}
                    />
                    {errors.awards_publish_date && (
                      <div className="error">
                        {errors.awards_publish_date.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">CPV Code</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="input here"
                      {...register("cpv_codes")}
                    />
                    {errors.cpv_codes && (
                      <div className="error">{errors.cpv_codes.message}</div>
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
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => navigateToCa()}
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

export default AddUpdateCaDetail;
