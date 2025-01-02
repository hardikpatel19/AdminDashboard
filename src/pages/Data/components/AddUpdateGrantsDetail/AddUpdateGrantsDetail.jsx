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
        navigate(`/grants`);
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
  
        if (data.grantsFile && data.grantsFile[0]) {
          fileUrl = await uploadFileToStorage(data.grantsFile[0]);
        }
  
        const documentData = {
          ...data,
          grantsFile: fileUrl,
          userId: auth.currentUser.uid,
          timestamp: new Date(),
        };
  
        if (grantsId) {
          const docRef = doc(db, "grantsDetail", grantsId);
          await updateDoc(docRef, documentData);
          toast.success("Document updated successfully");
          navigateToGrantsWithId(grantsId);
        } else {
          const docRef = await addDoc(
            collection(db, "grantsDetail"),
            documentData
          );
          toast.success("Form submitted successfully!");
          navigateToGrantsWithId(docRef.id);
        }
      } catch (error) {
        console.error("Error saving document:", error);
        toast.error("Error submitting the form. Please try again.");
      }
  
      dispatch({ type: "SET_LOADING", status: false });
    };
  
    // Fetch Data for Edit
    const fetchgrantsDetail = async () => {
      try {
        dispatch({ type: "SET_LOADING", status: true });
        const docRef = doc(db, "grantsDetail", grantsId);
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
      queryKey: ["grants-detail"],
      queryFn: fetchgrantsDetail,
      enabled: !!grantsId,
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
            <div className="header px-6">
              <h1 className="mb-0 h3">{title}</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="card mb-5">
                <div className="card-body">
                  <div className="row">
                    <div className="mb-4 col-md-4">
                      <label className="form-label">Donor<span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="donor"
                        {...register("Donor", { required: "Donor is required" })}
                      />
                      {errors.Donor && (
                        <div className="error">{errors.Donor.message}</div>
                      )}
                    </div>
  
                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                        Contact Information
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="contact_information"
                        {...register("ContactInformation")}
                      />
                      {errors.ContactInformation && (
                        <div className="error">{errors.ContactInformation.message}</div>
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
                        {...register("Type")}
                      />
                      {errors.Type && (
                        <div className="error">{errors.Type.message}</div>
                      )}
                    </div>
  
                    <div className="mb-4 col-md-4">
                      <label className="form-label">Status</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="status"
                        {...register("Status")}
                      />
                      {errors.Status && (
                        <div className="error">{errors.Status.message}</div>
                      )}
                    </div>
  
                    <div className="mb-4 col-md-4">
                      <label className="form-label">Value</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="value"
                        {...register("Value")}
                      />
                      {errors.Value && (
                        <div className="error">
                          {errors.Value.message}
                        </div>
                      )}
                    </div>
  
                    
  
                    <div className="mb-4 col-md-4">
                      <label className="form-label">Type Of Services</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="type_of_services"
                        {...register("TypeOfServices")}
                      />
                      {errors.TypeOfServices && (
                        <div className="error">{errors.TypeOfServices.message}</div>
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
                        {...register("Duration")}
                      />
                      {errors.Duration && (
                        <div className="error">
                          {errors.Duration.message}
                        </div>
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
                        {...register("Attachment")}
                      />
                      {errors.Attachment && (
                        <div className="error">
                          {errors.Attachment.message}
                        </div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                        Post Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Select post date"
                        {...register("post_date")}
                      />
                      {errors.post_date && (
                        <div className="error">
                          {errors.post_date.message}
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

export default AddUpdateGrantsDetail
