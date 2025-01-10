import React, { useEffect, useRef, useCallback, useState } from "react";
import { MdOutlineDelete, MdOutlineVisibility } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import { ConfirmationModal } from "../../../../../../components/Modals/ConfirmationModal";
import { ITEMS_PER_PAGE } from "../../../../../../Constants";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../../../../../firebaseConfig";
import { grantsData2 } from "../../../../../../utils/dummyData";
import { deleteGrantsDetail, getGrants } from "../../../../../../apiCall";
import { toast } from "react-toastify";

const GrantsData = () => {
  const [confirmationShow, setConfirmationShow] = useState(false);
  const [funHandler, setFunHandler] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [grantsList, setGrantsList] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const navigate = useNavigate();
  const viewFile = (id) => {
    console.log("View file with ID:", id);
    // Add logic to view the file, such as opening a modal or navigating to another page
  };
  const searchInput = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const grantsId = searchParams.get("Grants_id");
  const deleteData = async (docId) => {
    try {
      const docRef = doc(db, "grantsDetail", docId);
      const re = await deleteDoc(docRef);
      console.log(re);
      refetch();
      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error("Error deleting document: ", error);
    }
  };
  const editTGrantsDetail = (id) => {
    navigate(`/update/grants/${id}`);
  };
  const fetchGrantsList = async (pageNumber) => {
    try {
      const response = await getGrants(pageNumber);
      console.log(response);

      if (response?.status === 201) {
        console.log(response?.data?.result?.result);
        setTotalRecords(response?.data?.result.count);
        setTotalPages(Math.ceil(response?.data?.result.count / 10));
        setGrantsList(response?.data?.result?.result);
        setFilteredData(response?.data?.result?.result);
        setCurrentItems(response?.data?.result?.result);
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error); // Log any errors that occur
      throw error;
    }
  };
  const { refetch } = useQuery({
    queryKey: ["grants-list", currentPage],
    queryFn: () => fetchGrantsList(currentPage),
    onSuccess: (Re) => {
      console.log(Re);
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const handleSearch = () => {
    const query = searchInput.current.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleConfirmationClose = () => {
    setConfirmationShow(false);
  };
  const handleConfirmationShow = () => setConfirmationShow(true);

  const filterData = useCallback(
    (query) => {
      let filtered = grantsList;

      if (query) {
        filtered = filtered.filter((item) =>
          item.Name.toLowerCase().includes(query.toLowerCase())
        );
      }
      //   setFilteredData(filtered);
      //   setCurrentItems(filtered);
    },
    [grantsList] // Add dependencies here
  );
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const totalPageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    setTotalPages(totalPageCount);
    if (totalPageCount !== 0 && totalPageCount < currentPage) {
    }
  }, [currentPage, filteredData]);

  useEffect(() => {
    console.log(grantsId, filteredData);
    if (grantsId && filteredData.length > 0) {
      const targetIndex = filteredData.findIndex(
        (item) => item.ID === parseInt(grantsId)
      );
      if (targetIndex !== -1) {
        const pageNumber = Math.floor(targetIndex / ITEMS_PER_PAGE) + 1;
      }
    }
  }, [filteredData]);

  const deleteGrants = async (grantsId) => {
    const response = await deleteGrantsDetail(grantsId);
    console.log(response);
    if (response?.status === 201) {
      refetch();
      toast.success(response.data.message);
    } else {
      toast.error(response.response.data.message);
    }
  };

  return (
    <div id="app-content">
      {/* Container fluid */}
      <div className="app-content-area">
        <div className=" pt-10 pb-21 mt-n6 mx-n4" />
        <div className="container-fluid mt-n23 ">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-12">
              {/* Page header */}
              <div className="d-flex justify-content-between align-items-center mb-5">
                <div className="mb-2 mb-lg-0">
                  <h3 className="mb-0  ">Grants</h3>
                </div>
              </div>
            </div>
          </div>
          {/* row  */}

          <div className="row">
            <div className="col-12">
              {/* card */}
              <div className="card mb-4">
                <div className="card-header  ">
                  <div className="row ">
                    <div className="col-md-12 mb-3 d-flex justify-content-start">
                      <div
                        className="btn btn-primary me-2"
                        onClick={() => navigate("/add/grants")}
                      >
                        + Add Grants
                      </div>
                    </div>
                  </div>

                  <>
                    <div className="row justify-content-end">
                      <div className=" col-lg-3 col-md-6 mt-md-1 d-flex mb-1">
                        <label className="mt-3 me-1 form-label">Date:</label>
                        <input
                          ref={searchInput}
                          type="date"
                          className="form-control"
                          value={searchQuery}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              handleSearch();
                            }
                          }}
                          onClick={() => handleSearch()}
                          placeholder=""
                        />
                      </div>
                      <div className=" col-lg-3 col-md-6 mt-md-1 d-flex mb-1">
                        <label className="mt-3 me-1 form-label">To:</label>
                        <input
                          ref={searchInput}
                          type="date"
                          className="form-control"
                          value={searchQuery}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              handleSearch();
                            }
                          }}
                          onClick={() => handleSearch()}
                          placeholder=""
                        />
                      </div>
                      <div className=" col-lg-3 col-md-6 mt-md-1 d-flex mb-1">
                        <label className="mt-3 me-1 form-label">Search:</label>
                        <input
                          ref={searchInput}
                          type="search"
                          className="form-control "
                          //   value={searchQuery}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              handleSearch();
                            }
                          }}
                          onClick={() => handleSearch()}
                          placeholder=""
                        />
                      </div>
                    </div>
                  </>
                </div>
                {/* {!isLoading ? */}
                {/* ( */}
                <>
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      {currentItems.length > 0 ? (
                        <table className="table text-nowrap mb-0 table-centered table-hover">
                          <thead className="table-light">
                            <tr className="text-center">
                              <th className="">No</th>
                              <th className="">Donor</th>
                              <th className="">Contact Information</th>
                              <th className="">Location</th>
                              <th className="">Big Ref No</th>
                              <th className="">Title</th>
                              <th className="">Type</th>
                              <th className="">Status</th>
                              <th className="">Value</th>
                              <th className="">Type Of Services</th>
                              <th className="">Sectors</th>
                              <th className="">Deadline</th>
                              <th className="">Duration</th>
                              <th className="">Attachment</th>
                              <th className="">Post Date</th>
                              <th className="">Funding Agency</th>
                              <th className="">CPV Code</th>
                              <th className="">Regions</th>
                              <th>Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {currentItems.map((grants, index) => (
                              <tr
                                id={`user-${index}`}
                                className={`${
                                  grantsId === grants?.id ? "table-primary" : ""
                                }`}
                              >
                                <td>
                                  <strong>
                                    {(currentPage - 1) * ITEMS_PER_PAGE +
                                      (index + 1)}
                                    .
                                  </strong>
                                </td>
                                <td className="">
                                  <strong>{grants?.donor}</strong>
                                </td>
                                <td className="">
                                  <strong>{grants?.contact_information}</strong>
                                </td>
                                <td className="">{grants?.location}</td>
                                <td className="">{grants?.big_ref_no}</td>
                                <td className="">{grants?.title}</td>
                                <td className="">{grants?.type}</td>
                                <td className="">{grants?.status}</td>

                                <td className="">{grants?.value}</td>
                                <td className="">{grants?.type_of_services}</td>
                                <td className="">{grants?.sectors}</td>
                                <td className="">{grants?.deadline}</td>
                                <td className="">{grants?.duration}</td>
                                <td className="">{grants?.attachment}</td>
                                <td className="">{grants?.post_date}</td>
                                <td className="">{grants?.funding_agency}</td>
                                <td className="">{grants?.cpv_codes}</td>
                                <td className="">{grants?.regions}</td>
                                <td className="">{grants?.createAt}</td>

                                <td>
                                  <div
                                    className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                    data-template="viewOne"
                                    onClick={() => viewFile(grants.id)}
                                  >
                                    <MdOutlineVisibility
                                      size={22}
                                      style={{ fill: "#94a3b8" }}
                                    />
                                    <div id="viewOne" className="d-none">
                                      <span>View</span>
                                    </div>
                                  </div>
                                  <div
                                    className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                    data-template="editOne"
                                    onClick={() =>
                                      editTGrantsDetail(grants._id)
                                    }
                                  >
                                    <FaRegEdit
                                      size={20}
                                      style={{ fill: "#94a3b8" }}
                                    />
                                    <div id="editOne" className="d-none">
                                      <span>Edit</span>
                                    </div>
                                  </div>

                                  <div
                                    className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                    data-template="trashOne"
                                    onClick={() => {
                                      deleteGrants(grants._id);
                                    }}
                                  >
                                    <MdOutlineDelete
                                      size={22}
                                      style={{ fill: "#94a3b8" }}
                                    />
                                    <div
                                      id="trashOne"
                                      className="d-none"
                                      // onClick={() => deleteTask(task.ID)}
                                    >
                                      <span>Delete</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="m-5 fs-3">
                          <strong>No records found.!</strong>
                        </div>
                      )}
                    </div>
                  </div>
                  {filteredData.length > 0 && (
                    <div className="card-footer d-md-flex justify-content-between align-items-center">
                      <span>
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                        {Math.min(currentPage * ITEMS_PER_PAGE, totalRecords)}{" "}
                        of {totalRecords} entries
                      </span>
                      <nav className="mt-2 mt-md-0">
                        <ul className="pagination mb-0">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                            style={{
                              cursor:
                                currentPage === 1 ? "not-allowed" : "pointer",
                            }}
                            onClick={() => {
                              if (currentPage > 1) {
                                handlePageChange(currentPage - 1);
                              }
                            }}
                          >
                            <div className="page-link">Previous</div>
                          </li>

                          <li className="page-item active">
                            <div className="page-link">{currentPage}</div>
                          </li>

                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                            style={{
                              cursor:
                                currentPage === totalPages
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                            onClick={() => {
                              if (currentPage < totalPages) {
                                handlePageChange(currentPage + 1);
                              }
                            }}
                          >
                            <div className="page-link">Next</div>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
                {/* ) : (
                      <div className="m-5 fs-3">
                        <strong>Fetching records..</strong>
                      </div>
                    )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        show={confirmationShow}
        onHide={handleConfirmationClose}
        funHandler={funHandler}
      />
    </div>
  );
};

export default GrantsData;
