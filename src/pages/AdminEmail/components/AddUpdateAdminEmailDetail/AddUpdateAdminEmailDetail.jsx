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

const AddUpdateAdminEmailDetail = () => {
    const [, dispatch] = useStateValue();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchFilter = searchParams.get("search_filter");
    const [title, setTitle] = useState("Add Patient");
  
    const navigate = useNavigate();
    const { adminEmailId } = useParams();
  
    const navigateToAdminEmailWithId = (Id) => {
      if (searchFilter) {
        navigate(`/adminEmail?adminEmail_id=${Id}&search_filter=${searchFilter}`);
      } else {
        navigate(`/adminEmail?adminEmailt_id=${Id}`);
      }
    };
  
    const navigateToAdminEmail = () => {
      if (searchFilter) {
        navigate(`/adminEmail?search_filter=${searchFilter}`);
      } else {
        navigate(`/adminEmail`);
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
  
        if (data.adminEmailFile && data.adminEmailFile[0]) {
          fileUrl = await uploadFileToStorage(data.adminEmailFile[0]);
        }
  
        const documentData = {
          ...data,
          adminEmailFile: fileUrl,
          userId: auth.currentUser.uid,
          timestamp: new Date(),
        };
  
        if (adminEmailId) {
          const docRef = doc(db, "adminEmailDetail", adminEmailId);
          await updateDoc(docRef, documentData);
          toast.success("Document updated successfully");
          navigateToAdminEmailWithId(adminEmailId);
        } else {
          const docRef = await addDoc(
            collection(db, "adminEmailDetail"),
            documentData
          );
          toast.success("Form submitted successfully!");
          navigateToAdminEmailWithId(docRef.id);
        }
      } catch (error) {
        console.error("Error saving document:", error);
        toast.error("Error submitting the form. Please try again.");
      }
  
      dispatch({ type: "SET_LOADING", status: false });
    };
  
    // Fetch Data for Edit
    const fetchadminEmailDetail = async () => {
      try {
        dispatch({ type: "SET_LOADING", status: true });
        const docRef = doc(db, "adminEmailDetail", adminEmailId);
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
      queryKey: ["adminEmail-detail"],
      queryFn: fetchadminEmailDetail,
      enabled: !!adminEmailId,
      onSuccess: (Re) => console.log(Re),
      onError: (e) => console.error(e),
    });
  
    useEffect(() => {
      if (adminEmailId) {
        setTitle("Update AdminEmail");
      } else {
        setTitle("Add AdminEmail");
      }
    }, [adminEmailId]);
  
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
                  

                    <div className="mb-4 col-md-12">
                      <label className="form-label">
                        User Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter User Name"
                        {...register("UserName", { required: "UserName is required" })}
                      />
                      {errors.UserName && (
                        <div className="error">{errors.UserName.message}</div>
                      )}
                    </div>

                    <div className="mb-4 col-md-12">
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

                    
                    <div className="mb-4 col-md-6">
                      <label className="form-label">User Type</label>
                      <select className="form-select" {...register("UserType")}>
                        <option value="">Select a UserType</option>
                        <option value="meet">meet</option>
                        {/* <option value="Canada">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="India">India</option>
                        <option value="Australia">Australia</option> */}
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
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => navigateToAdminEmail()}
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
  

export default AddUpdateAdminEmailDetail
