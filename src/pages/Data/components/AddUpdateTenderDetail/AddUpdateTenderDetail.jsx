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


const AddUpdateTenderDetail = () => {
    const [, dispatch] = useStateValue();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchFilter = searchParams.get("search_filter");
    const [title, setTitle] = useState("Add Patient");
  
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
        navigate(`/tender`);
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
  
        if (data.tenderFile && data.tenderFile[0]) {
          fileUrl = await uploadFileToStorage(data.tenderFile[0]);
        }
  
        const documentData = {
          ...data,
          tenderFile: fileUrl,
          userId: auth.currentUser.uid,
          timestamp: new Date(),
        };
  
        if (tenderId) {
          const docRef = doc(db, "tenderDetail", tenderId);
          await updateDoc(docRef, documentData);
          toast.success("Document updated successfully");
          navigateToTenderWithId(tenderId);
        } else {
          const docRef = await addDoc(
            collection(db, "tenderDetail"),
            documentData
          );
          toast.success("Form submitted successfully!");
          navigateToTenderWithId(docRef.id);
        }
      } catch (error) {
        console.error("Error saving document:", error);
        toast.error("Error submitting the form. Please try again.");
      }
  
      dispatch({ type: "SET_LOADING", status: false });
    };
  
    // Fetch Data for Edit
    const fetchtenderDetail = async () => {
      try {
        dispatch({ type: "SET_LOADING", status: true });
        const docRef = doc(db, "tenderDetail", tenderId);
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
      queryKey: ["tender-detail"],
      queryFn: fetchtenderDetail,
      enabled: !!tenderId,
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
            <div className="header px-6">
              <h1 className="mb-0 h3">{title}</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="card mb-5">
                <div className="card-body">
                  <div className="row">
                  <div className="mb-4 col-md-4">
                      <label className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="title"
                        {...register("Title")}
                      />
                      {errors.Title && (
                        <div className="error">{errors.Title.message}</div>
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
                        {...register("Name", { required: "Name is required" })}
                      />
                      {errors.Name && (
                        <div className="error">{errors.Name.message}</div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="address"
                        {...register("Address")}
                      />
                      {errors.Address && (
                        <div className="error">{errors.Address.message}</div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                        Phone
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="telephone"
                        {...register("Mobile")}
                      />
                      {errors.Mobile && (
                        <div className="error">{errors.Mobile.message}</div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                        Fax Number
                      </label>
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
                      <label className="form-label">
                        Email
                      </label>
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

                    <div className="mb-4 col-md-10">
                      <label className="form-label">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="contact_person"
                        {...register("ContactPerson")}
                      />
                      {errors.ContactPerson && (
                        <div className="error">{errors.ContactPerson.message}</div>
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
                        {...register("BigRefNo", { required: "Number is required" })}
                      />
                      {errors.BigRefNo && (
                        <div className="error">{errors.BigRefNo.message}</div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                        Description
                      </label>
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
                      <label className="form-label">Tender Type</label>
                      <select className="form-select" {...register("Tendertype")}>
                        <option value="">Select a country</option>
                        <option value="Live">Live</option>
                        {/* <option value="Canada">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="India">India</option>
                        <option value="Australia">Australia</option> */}
                      </select>
                    </div> 

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                        Tender No
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="tender_no"
                        {...register("TenderNo")}
                      />
                      {errors.TenderNo && (
                        <div className="error">{errors.TenderNo.message}</div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                        Funding Agency
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="input here"
                        {...register("FundingAgency")}
                      />
                      {errors.FundingAgency && (
                        <div className="error">{errors.FundingAgency.message}</div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">Tender Compition</label>
                      <select className="form-select" {...register("TenderCompetion")}>
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
                      <label className="form-label">
                        Publishing Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Select publishing date"
                        {...register("PublishingDate")}
                      />
                      {errors.PublishingDate && (
                        <div className="error">
                          {errors.PublishingDate.message}
                        </div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                        Closing Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Select closing date"
                        {...register("ClosingDate")}
                      />
                      {errors.ClosingDate && (
                        <div className="error">
                          {errors.ClosingDate.message}
                        </div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                        Country
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="input here"
                        {...register("Country")}
                      />
                      {errors.Country && (
                        <div className="error">{errors.Country.message}</div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                       EMD
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="emd"
                        {...register("Emd")}
                      />
                      {errors.Emd && (
                        <div className="error">{errors.Emd.message}</div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                      Estimated Cost
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="estimated_cost"
                        {...register("Estimatedcost")}
                      />
                      {errors.Estimatedcost && (
                        <div className="error">{errors.Estimatedcost.message}</div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                      Documents
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        placeholder="documents"
                        {...register("Documents")}
                      />
                      {errors.Documents && (
                        <div className="error">{errors.Documents.message}</div>
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
                        {...register("Sectors", { required: "Sector is required" })}
                      />
                      {errors.Sectors && (
                        <div className="error">{errors.Sectors.message}</div>
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
                        {...register("Regions", {
                          required: "Region is required",
                        })}
                      />
                      {errors.Regions && (
                        <div className="error">
                          {errors.Regions.message}
                        </div>
                      )}
                    </div>

                    <div className="mb-4 col-md-4">
                      <label className="form-label">
                        CPV Code<span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="input here"
                        {...register("CpvCode", {
                          required: "CPV Code is required",
                        })}
                      />
                      {errors.CpvCode && (
                        <div className="error">
                          {errors.CpvCode.message}
                        </div>
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
  

export default AddUpdateTenderDetail
