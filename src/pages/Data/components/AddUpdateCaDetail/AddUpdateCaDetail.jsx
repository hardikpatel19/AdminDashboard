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
      navigate(`/ca`);
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

      if (data.caFile && data.caFile[0]) {
        fileUrl = await uploadFileToStorage(data.caFile[0]);
      }

      const documentData = {
        ...data,
        caFile: fileUrl,
        userId: auth.currentUser.uid,
        timestamp: new Date(),
      };

      if (caId) {
        const docRef = doc(db, "caDetail", caId);
        await updateDoc(docRef, documentData);
        toast.success("Document updated successfully");
        navigateToCaWithId(caId);
      } else {
        const docRef = await addDoc(
          collection(db, "caDetail"),
          documentData
        );
        toast.success("Form submitted successfully!");
        navigateToCaWithId(docRef.id);
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Error submitting the form. Please try again.");
    }

    dispatch({ type: "SET_LOADING", status: false });
  };

  // Fetch Data for Edit
  const fetchcaDetail = async () => {
    try {
      dispatch({ type: "SET_LOADING", status: true });
      const docRef = doc(db, "caDetail", caId);
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
    queryKey: ["ca-detail"],
    queryFn: fetchcaDetail,
    enabled: !!caId,
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
          <div className="header px-6">
            <h1 className="mb-0 h3">{title}</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card mb-5">
              <div className="card-body">
                <div className="row">
                  <div className="mb-4 col-md-4">
                    <label className="form-label">Title<span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="title"
                      {...register("Title", { required: "Title is required" })}
                    />
                    {errors.Title && (
                      <div className="error">{errors.Title.message}</div>
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
                      {...register("Name", { required: "Name is required" })}
                    />
                    {errors.Name && (
                      <div className="error">{errors.Name.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Organisation Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="org_address"
                      {...register("OrgAddress")}
                    />
                    {errors.OrgAddress && (
                      <div className="error">{errors.OrgAddress.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Phone</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="telephone_no"
                      {...register("Phone")}
                    />
                    {errors.Phone && (
                      <div className="error">{errors.Phone.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Fax Number</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="fax_number"
                      {...register("FaxNumber")}
                    />
                    {errors.FaxNumber && (
                      <div className="error">{errors.FaxNumber.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="email"
                      {...register("Email")}
                    />
                    {errors.Email && (
                      <div className="error">{errors.Email.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Contact Person</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="contact_person"
                      {...register("ContactPerson")}
                    />
                    {errors.ContactPerson && (
                      <div className="error">
                        {errors.ContactPerson.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Big Ref Number</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="big_ref_no"
                      {...register("BigRefNo")}
                    />
                    {errors.BigRefNo && (
                      <div className="error">{errors.BigRefNo.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Document Number</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="document_no"
                      {...register("DocumentNo")}
                    />
                    {errors.DocumentNo && (
                      <div className="error">{errors.DocumentNo.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Bidding Type</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="bidding_type"
                      {...register("BiddingType")}
                    />
                    {errors.BiddingType && (
                      <div className="error">{errors.BiddingType.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Project Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="project_location"
                      {...register("ProjectLocation")}
                    />
                    {errors.ProjectLocation && (
                      <div className="error">
                        {errors.ProjectLocation.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Contract Details</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="contract_details"
                      {...register("ContractorDetails")}
                    />
                    {errors.ContractorDetails && (
                      <div className="error">
                        {errors.ContractorDetails.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Tender Notice Number</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="tender_notice_no"
                      {...register("TenderNoticeNo")}
                    />
                    {errors.TenderNoticeNo && (
                      <div className="error">
                        {errors.TenderNoticeNo.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="description"
                      {...register("Description")}
                    />
                    {errors.Description && (
                      <div className="error">{errors.Description.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Select publish date"
                      {...register("AwardsPublishDate")}
                    />
                    {errors.AwardsPublishDate && (
                      <div className="error">
                        {errors.AwardsPublishDate.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">CPV Code</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="input here"
                      {...register("CPVCode")}
                    />
                    {errors.CPVCode && (
                      <div className="error">{errors.CPVCode.message}</div>
                    )}
                  </div>

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Sector</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="input here"
                      {...register("Sectors")}
                    />
                    {errors.Sectors && (
                      <div className="error">{errors.Sectors.message}</div>
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

                  <div className="mb-4 col-md-4">
                    <label className="form-label">Region</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="input here"
                      {...register("Regions")}
                    />
                    {errors.Regions && (
                      <div className="error">{errors.Regions.message}</div>
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
