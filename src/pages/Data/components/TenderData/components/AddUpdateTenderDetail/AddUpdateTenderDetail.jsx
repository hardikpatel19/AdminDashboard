import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useStateValue } from "../../../../../../StateProvider";
import { ConfirmationModal } from "../../../../../../components/Modals/ConfirmationModal";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addTenderDetail, getTenderDetail, updateTenderDetail } from "../../../../../../apiCall";
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

const AddUpdateTenderDetail = () => {
  const [, dispatch] = useStateValue();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFilter = searchParams.get("search_filter");
  const [title, setTitle] = useState("Add Tender");

  const navigate = useNavigate();
  const { tenderId } = useParams();

  const navigateToTenderWithId = (Id) => {
    if (searchFilter) {
      navigate(`/tender?tender_id=${Id}&search_filter=${searchFilter}`);
    } else {
      navigate(`/tender?tendert_id=${Id}`);
    }
  };

  const navigateToTender = () => {
    if (searchFilter) {
      navigate(`/tender?search_filter=${searchFilter}`);
    } else {
      navigate(`/tenderData`);
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
      if (tenderId) {
        data._id = tenderId;
        const response = await updateTenderDetail(data);
        console.log(response);
        if (response?.status === 201) {
          toast.success(response.data.message);
          navigate("/tenderData");
        }
        else{
          toast.error(response.response.data.message);

        }
      } else {
      dispatch({ type: "SET_LOADING", status: true });
        const response = await addTenderDetail(data);
        console.log(response);
        if (response?.status === 201) {
          toast.success(response.data.message);
          navigate("/tenderData");
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
  const fetchtenderDetail = async () => {
    try {
      dispatch({ type: "SET_LOADING", status: true });
      const response = await getTenderDetail(tenderId);
      console.log(response);

      if (response?.status === 201) {
        setValue("title", response?.data?.result?.title);
        setValue("authority_name", response?.data?.result?.authority_name);
        setValue("address", response?.data?.result?.address);
        setValue("telephone", response?.data?.result?.telephone);
        setValue("fax_number", response?.data?.result?.fax_number);
        setValue("email", response?.data?.result?.email);
        setValue("contact_person", response?.data?.result?.contact_person);
        setValue("big_ref_no", response?.data?.result?.big_ref_no);
        setValue("description", response?.data?.result?.description);
        setValue("country", response?.data?.result?.country);
        setValue("tender_no", response?.data?.result?.tender_no);
        setValue("funding_agency", response?.data?.result?.funding_agency);
        setValue("tender_competition", response?.data?.result?.tender_competition);
        setValue("published_date", response?.data?.result?.published_date);
        setValue("closing_date", response?.data?.result?.closing_date);
        setValue("country", response?.data?.result?.country);
        setValue("emd", response?.data?.result?.emd);
        setValue("estimated_cost", response?.data?.result?.estimated_cost);
        setValue("documents", response?.data?.result?.documents);
        setValue("sectors", response?.data?.result?.sectors);
        setValue("regions", response?.data?.result?.regions);
        setValue("cpv_codes", response?.data?.result?.cpv_codes);
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
    queryKey: ["tender-detail"],
    queryFn: fetchtenderDetail,
    enabled: tenderId ? true : false,
    onSuccess: (Re) => console.log(Re),
    onError: (e) => console.error(e),
  });

  useEffect(() => {
    if (tenderId) {
      setTitle("Update Tender");
    } else {
      setTitle("Add Tender");
    }
  }, [tenderId]);

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
                    <label className="form-label">
                      Authority Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Authority Name"
                      {...register("authority_name", {
                        required: "Authority Name is required",
                      })}
                    />
                    {errors.authority_name && (
                      <div className="error">
                        {errors.authority_name.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="address"
                      {...register("address")}
                    />
                    {errors.address && (
                      <div className="error">{errors.address.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Phone</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="telephone"
                      {...register("telephone")}
                    />
                    {errors.telephone && (
                      <div className="error">{errors.telephone.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Fax Number</label>
                    <input
                      type="text"
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

                  <div className="mb-4 col-md-10">
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
                    <label className="form-label">
                      Big Ref Number<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="big_ref_no"
                      {...register("big_ref_no", {
                        required: "big_ref_no is required",
                      })}
                    />
                    {errors.big_ref_no && (
                      <div className="error">{errors.big_ref_no.message}</div>
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
                    <label className="form-label">Tender Type</label>
                    <select className="form-select" {...register("tender_type")}>
                      <option value="">Select a Tender</option>
                      <option value="Defense Forces">Defense Forces</option>
                      {/* <option value="Canada">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="India">India</option>
                        <option value="Australia">Australia</option> */}
                    </select>
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Tender No</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Tender No"
                      {...register("tender_no")}
                    />
                    {errors.TenderNo && (
                      <div className="error">{errors.tender_no.message}</div>
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
                    <label className="form-label">Tender Compition</label>
                    <select
                      className="form-select"
                      {...register("tender_competition")}
                    >
                      <option value="">Select a Tender Competion</option>
                      <option value="Live">Domestic</option>
                      <option value="Live">Not Specified</option>
                      {/* <option value="Canada">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="India">India</option>
                        <option value="Australia">Australia</option> */}
                    </select>
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Publishing Date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Select publishing date"
                      {...register("published_date")}
                    />
                    {errors.published_date && (
                      <div className="error">
                        {errors.published_date.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Closing Date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Select closing date"
                      {...register("closing_date")}
                    />
                    {errors.closing_date && (
                      <div className="error">{errors.closing_date.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="input here"
                      {...register("country")}
                    />
                    {errors.country && (
                      <div className="error">{errors.country.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">EMD</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="emd"
                      {...register("emd")}
                    />
                    {errors.emd && (
                      <div className="error">{errors.emd.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Estimated Cost</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="estimated_cost"
                      {...register("estimated_cost")}
                    />
                    {errors.estimated_cost && (
                      <div className="error">
                        {errors.estimated_cost.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Documents</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="documents"
                      {...register("documents")}
                    />
                    {errors.documents && (
                      <div className="error">{errors.documents.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">
                      Sector<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="input here"
                      {...register("sectors", {
                        required: "Sector is required",
                      })}
                    />
                    {errors.sectors && (
                      <div className="error">{errors.sectors.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">
                      Region<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="input here"
                      {...register("regions", {
                        required: "Region is required",
                      })}
                    />
                    {errors.regions && (
                      <div className="error">{errors.regions.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">
                      CPV Code<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="input here"
                      {...register("cpv_codes", {
                        required: "CPV Code is required",
                      })}
                    />
                    {errors.cpv_codes && (
                      <div className="error">{errors.cpv_codes.message}</div>
                    )}
                  </div>

                  {/* <div className="mb-4 col-md-6">
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
                    </div> */}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => navigateToTender()}
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

export default AddUpdateTenderDetail;
