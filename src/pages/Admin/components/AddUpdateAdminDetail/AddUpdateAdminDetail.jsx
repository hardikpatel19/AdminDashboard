import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useStateValue } from "../../../../StateProvider";
import { ConfirmationModal } from "../../../../components/Modals/ConfirmationModal";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addAdminDetail, getAdminDetail, updateAdminDetail } from "../../../../apiCall";

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

const AddUpdateAdminDetail = () => {
    const [, dispatch] = useStateValue();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchFilter = searchParams.get("search_filter");
    const [title, setTitle] = useState("Add Admin");
  
    const navigate = useNavigate();
    const { adminId } = useParams();
  
    const navigateToAdminWithId = (Id) => {
      if (searchFilter) {
        navigate(`/admin?admin_id=${Id}&search_filter=${searchFilter}`);
      } else {
        navigate(`/admin?admint_id=${Id}`);
      }
    };
  
    const navigateToAdmin = () => {
      if (searchFilter) {
        navigate(`/admin?search_filter=${searchFilter}`);
      } else {
        navigate(`/admin`);
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
         if (adminId) {
          //  data.id = adminId;
           const response = await updateAdminDetail(data,adminId);
           console.log(response);
           if (response?.status === 200) {
             toast.success(response.data.message);
             navigate("/admin");
           }
           else{
             toast.error(response.response.data.message);
   
           }
         } else {
         dispatch({ type: "SET_LOADING", status: true });
           const response = await addAdminDetail(data);
           console.log(response);
           if (response?.status === 201) {
             toast.success(response.data.message);
             navigate("/admin");
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
      const fetchadminDetail = async () => {
        try {
          dispatch({ type: "SET_LOADING", status: true });
          const response = await getAdminDetail(adminId);
          console.log(response);
    
          if (response?.status === 200) {
            setValue("user_name", response?.data?.data?.user_name);
            setValue("email", response?.data?.data?.email);
            setValue("role", response?.data?.data?.role);
            setValue("status", response?.data?.data?.status);
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
      queryKey: ["admin-detail"],
      queryFn: fetchadminDetail,
      enabled: adminId ? true : false,
      onSuccess: (Re) => console.log(Re),
      onError: (e) => console.error(e),
    });
  
    useEffect(() => {
      if (adminId) {
        setTitle("Update Admin");
      } else {
        setTitle("Add Admin");
      }
    }, [adminId]);
  
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
                        {...register("user_name", { required: "UserName is required" })}
                      />
                      {errors.user_name && (
                        <div className="error">{errors.user_name.message}</div>
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
                        {...register("email")}
                      />
                      {errors.email && (
                        <div className="error">{errors.email.message}</div>
                      )}
                    </div>

                    
                    <div className="mb-4 col-md-6">
                      <label className="form-label">User Type</label>
                      <select className="form-select" {...register("role")}>
                        <option value="">Select a UserType</option>
                        <option value="Admin">Admin</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="User">User</option>
                      </select>
                    </div> 

                    <div className="mb-4 col-md-6">
                      <label className="form-label">Status</label>
                      <select className="form-select" {...register("status")}>
                        <option value="">Select a status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => navigateToAdmin()}
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
  

export default AddUpdateAdminDetail
