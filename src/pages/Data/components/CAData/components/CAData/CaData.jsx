import React, { useEffect, useRef, useCallback, useState } from "react";
import { MdOutlineDelete, MdOutlineVisibility } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import { ConfirmationModal } from "../../../../../../components/Modals/ConfirmationModal";
import { ITEMS_PER_PAGE } from "../../../../../../Constants";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../../../../../firebaseConfig";
import { caData2 } from "../../../../../../utils/dummyData";
import { getCa } from "../../../../../../apiCall";
import { toast } from "react-toastify";

const CaData = () => {
  const viewFile = (id) => {
    console.log("View file with ID:", id);
    // Add logic to view the file, such as opening a modal or navigating to another page
  };
  const searchInput = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const caId = searchParams.get("Ca_id");
  const deleteData = async (docId) => {
    try {
      const docRef = doc(db, "caDetail", docId);
      const re = await deleteDoc(docRef);
      console.log(re);
      refetch();
      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error("Error deleting document: ", error);
    }
  };
  const editTCaDetail = (id) => {
    navigate(`/update/ca/${id}?status_filter=${searchQuery}`);
  };
  const fetchCaList = async () => {
    try {
      const response = await getCa();
      console.log(response);

      if (response?.status === 201) {
        console.log(response?.data?.result?.result);
        setCaList(response?.data?.result?.result);
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
    queryKey: ["ca-list"],
    queryFn: () => fetchCaList(),
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
  const [confirmationShow, setConfirmationShow] = useState(false);
  const [funHandler, setFunHandler] = useState();
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [caList, setCaList] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredData, setFilteredData] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const navigate = useNavigate();

  const handleConfirmationClose = () => {
    setConfirmationShow(false);
  };
  const handleConfirmationShow = () => setConfirmationShow(true);

  const filterData = useCallback(
    (query) => {
      let filtered = caList;

      if (query) {
        filtered = filtered.filter((item) =>
          item.Name.toLowerCase().includes(query.toLowerCase())
        );
      }
      //   setFilteredData(filtered);
      //   setCurrentItems(filtered);
    },
    [caList] // Add dependencies here
  );
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const removeSelection = () => {
    navigate("/ca");
  };
  useEffect(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const totalPageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    // setCurrentItems(filteredData.slice(startIdx, startIdx + ITEMS_PER_PAGE));
    setTotalPages(totalPageCount);
    if (totalPageCount !== 0 && totalPageCount < currentPage) {
      setCurrentPage(totalPageCount);
    }
  }, [currentPage, filteredData]);

  useEffect(() => {
    filterData(searchQuery);
    setCurrentPage(1);
  }, [searchQuery, filterData]);

  useEffect(() => {
    console.log(caId, filteredData);
    if (caId && filteredData.length > 0) {
      const targetIndex = filteredData.findIndex(
        (item) => item.ID === parseInt(caId)
      );
      if (targetIndex !== -1) {
        const pageNumber = Math.floor(targetIndex / ITEMS_PER_PAGE) + 1;
        setCurrentPage(pageNumber);
        // setCurrentItems(
        //   filteredData.slice(targetIndex, targetIndex + Number(sysConfig["Rows in MultiLine List"]))
        // );
      }
    }
  }, [filteredData]);
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
                  <h3 className="mb-0  ">CA</h3>
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
                        onClick={() => navigate("/add/ca")}
                      >
                        + Add Ca
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
                              <th className="">Title</th>
                              <th className="">Org Name</th>
                              <th className="">Org Address</th>
                              <th className="">Phone</th>
                              <th className="">Fax Number</th>
                              <th className="">Email</th>
                              <th className="">Contact Person</th>
                              <th className="">Big Ref No</th>
                              <th className="">Document No</th>
                              <th className="">Bidding Type</th>
                              <th className="">Project Location</th>
                              <th className="">Contractor Details</th>
                              <th className="">Tender Notice No</th>
                              <th className="">Description</th>
                              <th className="">Sectors</th>
                              <th className="">Awards Publish Date</th>
                              <th className="">Funding Agency</th>
                              <th className="">CPV Code</th>
                              <th className="">Regions</th>
                              <th>Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {currentItems.map((ca, index) => (
                              <tr
                                id={`user-${index}`}
                                className={`${
                                  caId === ca?.id ? "table-primary" : ""
                                }`}
                              >
                                <td>
                                  <strong>{index + 1}.</strong>
                                </td>
                                <td className="">
                                  <strong>{ca?.title}</strong>
                                </td>
                                <td className="">
                                  <strong>{ca?.Name}</strong>
                                </td>
                                <td className="">{ca?.OrgAddress}</td>
                                <td className="">{ca?.Phone}</td>
                                <td className="">{ca?.FaxNumber}</td>
                                <td className="">{ca?.Email}</td>
                                <td className="">{ca?.ContactPerson}</td>

                                <td className="">{ca?.big_ref_no}</td>
                                <td className="">{ca?.DocumentNo}</td>
                                <td className="">{ca?.BiddingType}</td>
                                <td className="">{ca?.project_location}</td>
                                <td className="">{ca?.contractor_details}</td>
                                <td className="">{ca?.TenderNoticeNo}</td>
                                <td className="">{ca?.description}</td>
                                <td className="">{ca?.sectors}</td>
                                <td className="">{ca?.awards_publish_date}</td>
                                <td className="">{ca?.funding_agency}</td>
                                <td className="">{ca?.cpv_codes}</td>
                                <td className="">{ca?.regions}</td>
                                <td className="">{ca?.Date}</td>

                                <td>
                                  <div
                                    className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                    data-template="viewOne"
                                    onClick={() => viewFile(ca.id)}
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
                                    onClick={() => editTCaDetail(ca.id)}
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
                                      handleConfirmationShow();
                                      removeSelection();
                                      setFunHandler({
                                        fun: deleteData,
                                        id: ca.id,
                                        title: "delete task",
                                      });
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
                        Showing{" "}
                        {currentPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE + 1} to{" "}
                        {currentPage * ITEMS_PER_PAGE >= filteredData.length
                          ? filteredData.length
                          : currentPage * ITEMS_PER_PAGE}{" "}
                        of {filteredData.length} entries
                      </span>
                      <nav className="mt-2 mt-md-0">
                        <ul className="pagination mb-0 ">
                          <li
                            className="page-item "
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (currentPage > 1) {
                                handlePageChange(currentPage - 1);
                                removeSelection();
                              }
                            }}
                          >
                            <div className="page-link">Previous</div>
                          </li>
                          {Array(totalPages ? totalPages : 0)
                            .fill()
                            .map((item, index) => (
                              <li
                                style={{ cursor: "pointer" }}
                                className={`${
                                  currentPage === index + 1
                                    ? "page-item active"
                                    : "page-item"
                                }`}
                                onClick={() => {
                                  handlePageChange(index + 1);
                                  removeSelection();
                                }}
                              >
                                <div className="page-link">{index + 1}</div>
                              </li>
                            ))}

                          <li className="page-item">
                            <div
                              style={{ cursor: "pointer" }}
                              className="page-link"
                              onClick={() => {
                                if (totalPages > currentPage) {
                                  removeSelection();
                                  handlePageChange(currentPage + 1);
                                }
                              }}
                            >
                              Next
                            </div>
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

export default CaData;
