import React, { useEffect, useRef, useCallback, useState } from "react";
import { MdOutlineDelete, MdOutlineVisibility } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import { ConfirmationModal } from "../../../../../../components/Modals/ConfirmationModal";
import { ITEMS_PER_PAGE } from "../../../../../../Constants";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../../../../../firebaseConfig";
import { tenderData2 } from "../../../../../../utils/dummyData";
import { deleteTenderDetail, getTender } from "../../../../../../apiCall";
import { toast } from "react-toastify";

const TenderData = () => {
  const [confirmationShow, setConfirmationShow] = useState(false);
  const [funHandler, setFunHandler] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tenderList, setTenderList] = useState();
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
  const tenderId = searchParams.get("Tender_id");
  const deleteData = async (docId) => {
    try {
      const docRef = doc(db, "tenderDetail", docId);
      const re = await deleteDoc(docRef);
      console.log(re);
      refetch();
      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error("Error deleting document: ", error);
    }
  };
  const editTTenderDetail = (id) => {
    navigate(`/update/tender/${id}`);
  };
  const fetchTenderList = async (pageNumber) => {
    try {
      const response = await getTender(pageNumber);
      console.log(response);

      if (response?.status === 201) {
        // console.log(Math.ceil(response?.data?.result.count/10));
        setTotalRecords(response?.data?.result.count);
        setTotalPages(Math.ceil(response?.data?.result.count / 10));
        setTenderList(response?.data?.result?.result);
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
    queryKey: ["tender-list", currentPage],
    queryFn: () => fetchTenderList(currentPage),
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
      let filtered = tenderList;

      if (query) {
        filtered = filtered.filter((item) =>
          item.Name.toLowerCase().includes(query.toLowerCase())
        );
      }
      // setFilteredData(filtered);
      // setCurrentItems(filtered);
    },
    [tenderList] // Add dependencies here
  );
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const totalPageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    if (totalPageCount !== 0 && totalPageCount < currentPage) {
      // setCurrentPage(totalPageCount);
    }
  }, [currentPage, filteredData]);

  useEffect(() => {
    console.log(tenderId, filteredData);
    if (tenderId && filteredData.length > 0) {
      const targetIndex = filteredData.findIndex(
        (item) => item.ID === parseInt(tenderId)
      );
      if (targetIndex !== -1) {
        const pageNumber = Math.floor(targetIndex / ITEMS_PER_PAGE) + 1;
        // setCurrentPage(pageNumber);
        // setCurrentItems(
        //   filteredData.slice(targetIndex, targetIndex + Number(sysConfig["Rows in MultiLine List"]))
        // );
      }
    }
  }, [filteredData]);

  const deleteTender = async (tenderId) => {
    const response = await deleteTenderDetail(tenderId);
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
                  <h3 className="mb-0  ">Tender</h3>
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
                    <div className="col-md-12 mb-3 d-flex justify-content-end">
                      <div
                        className="btn btn-primary me-2"
                        onClick={() => navigate("/add/tender")}
                      >
                        + Add Tender
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
                      {console.log(currentItems)}
                      {currentItems.length > 0 ? (
                        <table className="table text-nowrap mb-0 table-centered table-hover">
                          <thead className="table-light">
                            <tr className="text-center">
                              <th className="">No</th>
                              <th className="">Title</th>
                              <th className="">Authority Name</th>
                              <th className="">Address</th>
                              <th className="">Phone</th>
                              <th className="">Fax Number</th>
                              <th className="">Email</th>
                              <th className="">Contact Person</th>
                              <th className="">Big Ref No</th>
                              <th className="">Description</th>
                              <th className="">Tender Type</th>
                              <th className="">Tender No</th>
                              <th className="">Funding Agency</th>
                              <th className="">Tender Competion</th>
                              <th className="">Publishing Date</th>
                              <th className="">Closing Date</th>
                              <th className="">Country</th>
                              <th className="">Emd</th>
                              <th className="">Estimated cost</th>
                              <th className="">Documents</th>
                              <th className="">Sectors</th>
                              <th className="">Cpv Code</th>
                              <th className="">Regions</th>
                              <th>Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {currentItems.map((tender, index) => (
                              <tr
                                id={`user-${index}`}
                                className={`${
                                  tenderId === tender?.id ? "table-primary" : ""
                                }`}
                              >
                                <td>
                                  <strong>
                                    {(currentPage - 1) * ITEMS_PER_PAGE +
                                      (index + 1)}
                                    .
                                  </strong>
                                </td>
                                <td
                                  className=""
                                  style={{
                                    maxWidth: "400px",
                                    minWidth: "220px",
                                    textWrap: "wrap",
                                  }}
                                >
                                  <strong>{tender?.title}</strong>
                                </td>
                                <td className=""
                                style={{
                                    maxWidth: "400px",
                                    minWidth: "220px",
                                    textWrap: "wrap",
                                  }}>
                                  <strong>{tender?.authority_name}</strong>
                                </td>
                                <td className=""
                                style={{
                                    maxWidth: "400px",
                                    minWidth: "220px",
                                    textWrap: "wrap",
                                  }}>{tender?.address}</td>
                                <td className="">{tender?.telephone}</td>
                                <td className="">{tender?.fax_number}</td>
                                <td className="">{tender?.email}</td>
                                <td className="">{tender?.contact_person}</td>

                                <td className="">{tender?.big_ref_no}</td>
                                <td
                                  className=""
                                  style={{
                                    maxWidth: "400px",
                                    minWidth: "220px",
                                    textWrap: "wrap",
                                  }}
                                >
                                  {tender?.description}
                                </td>
                                <td className="">{tender?.tender_type}</td>
                                <td className="">{tender?.tender_no}</td>
                                <td className="">{tender?.funding_agency}</td>
                                <td className="">{tender?.tender_competition}</td>
                                <td className="">{tender?.published_date}</td>
                                <td className="">{tender?.closing_date}</td>
                                <td className="">{tender?.country}</td>
                                <td className="">{tender?.emd}</td>
                                <td className="">{tender?.estimated_cost}</td>
                                <td className=""
                                style={{
                                    maxWidth: "400px",
                                    minWidth: "220px",
                                    textWrap: "wrap",
                                  }}>{tender?.documents}</td>
                                <td className="">{tender?.sectors}</td>
                                <td className="">{tender?.cpv_codes}</td>
                                <td className="">{tender?.regions}</td>
                                <td className="">{tender?.createdAt}</td>
                                {/* <td>
                                      <div className="truncate">
                                        {script?.DeveloperName}
                                      </div>
                                    </td>
                                    <td className="">{script?.Status}</td> */}
                                <td>
                                  <div
                                    className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                    data-template="viewOne"
                                    onClick={() => viewFile(tender.id)}
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
                                      editTTenderDetail(tender._id)
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
                                      deleteTender(tender._id);
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

export default TenderData;
