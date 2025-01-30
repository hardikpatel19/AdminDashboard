import React, { useEffect, useRef, useCallback, useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import { useStateValue } from "../../../../StateProvider";
import { ConfirmationModal } from "../../../../components/Modals/ConfirmationModal";
import { ITEMS_PER_PAGE } from "../../../../Constants";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteDeveloperDetail, getDeveloper } from "../../../../apiCall";

const Developer = () => {
  const [confirmationShow, setConfirmationShow] = useState(false);
  const [funHandler, setFunHandler] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [developerList, setDeveloperList] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [, dispatch] = useStateValue();
  const [filteredData, setFilteredData] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const navigate = useNavigate();

  const searchInput = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const developerId = searchParams.get("Developer_id");
  // const deleteData = async (docId) => {
  //   try {
  //     const docRef = doc(db, "developerDetail", docId);
  //     const re = await deleteDoc(docRef);
  //     console.log(re);
  //     refetch();
  //     toast.success("Document deleted successfully");
  //   } catch (error) {
  //     toast.error("Error deleting document: ", error);
  //   }
  // };
  const editTDeveloperDetail = (id) => {
    navigate(`/update/developer/${id}`);
  };
  const fetchDeveloperList = async (pageNumber) => {
    try {
      console.log("dfsdf")
      const response = await getDeveloper(pageNumber);
      console.log(response,"***************");

      if (response?.status === 200) {
        // console.log(Math.ceil(response?.data?.result.count/10));
        setTotalRecords(response?.data?.data.count);
        setTotalPages(Math.ceil(response?.data?.data.count/ 10));
        setDeveloperList(response?.data?.data?.data);
        setFilteredData(response?.data?.data?.data);
        setCurrentItems(response?.data?.data?.data);
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error); // Log any errors that occur
      throw error;
    }
  };

  const { refetch } = useQuery({
    queryKey: ["developer-list", currentPage],
    queryFn: () => fetchDeveloperList(currentPage),
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
      let filtered = developerList;

      if (query) {
        filtered = filtered.filter((item) =>
          item.Name.toLowerCase().includes(query.toLowerCase())
        );
      }
      // setFilteredData(filtered);
      // setCurrentItems(filtered);
    },
    [developerList] // Add dependencies here
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
    console.log(developerId, filteredData);
    if (developerId && filteredData.length > 0) {
      const targetIndex = filteredData.findIndex(
        (item) => item.ID === parseInt(developerId)
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

  const deleteDeveloper = async (developerId) => {
    dispatch({ type: "SET_LOADING", status: true });
    const response = await deleteDeveloperDetail(developerId);
    console.log(response);
    if (response?.status === 200) {
      refetch();
      toast.success(response.data.message);
    } else {
      toast.error(response.response.data.message);
    }
    dispatch({ type: "SET_LOADING", status: false });
  };
  return (
    <div id="app-content">
      {/* Container fluid */}
      <div className="app-content-area">
        <div className=" pt-10 pb-21 mt-n6 mx-n4" />
        <div className="container-fluid mt-n22 ">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-12">
              {/* Page header */}
              <div className="d-flex justify-content-between align-items-center mb-5">
                <div className="mb-2 mb-lg-0">
                  <h3 className="mb-0  ">Developer</h3>
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
                        onClick={() => navigate("/add/developer")}
                      >
                        + Add Developer
                      </div>
                    </div>
                  </div>
                  <>
                    <div className="row align-items-center">
                      <div className="col-lg-4 col-md-6 mt-md-2 d-flex justify-content-start mb-1">
                        <input
                          ref={searchInput}
                          type="search"
                          className="form-control"
                          // value={searchQuery}
                          onChange={(e) => {
                            if (e.target.value === "Name") {
                              handleSearch();
                            }
                          }}
                          onClick={() => handleSearch()}
                          placeholder="Search by name, email, phone, or status"
                        />
                      </div>
                      <div className="col-lg-2 col-md-6 mt-md-2 d-flex justify-content-end mb-1">
                        <input
                          ref={searchInput}
                          type="search"
                          className="form-control"
                          list="statusOptions" // Connects the input to the datalist
                          onChange={(e) => {
                            if (e.target.value === "Status") {
                              handleSearch();
                            }
                          }}
                          onClick={() => handleSearch()}
                          placeholder="Status"
                        />
                        {/* Datalist for predefined options */}
                        <datalist id="statusOptions">
                          <option value="Active" />
                          <option value="Inactive" />
                          <option value="Pending" />
                          <option value="Completed" />
                        </datalist>
                      </div>
                    </div>
                  </>
                </div>
                {/* {!isLoading ? ( */}
                <>
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      {currentItems.length > 0 ? (
                        <table className="table text-nowrap mb-0 table-centered table-hover">
                          <thead className="table-light">
                            <tr className="text-center">
                              <th className="">No</th>
                              <th className="">Developer</th>
                              <th className="">Phone</th>
                              <th className="">Email</th>
                              <th className="">Location</th>
                              <th className="">Total Script Count </th>
                              <th className="">Active Script Count </th>
                              <th className="">Maintain Script Count </th>
                              <th className="">Create Date</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {currentItems.map((developer, index) => (
                              <tr
                                id={`user-${index}`}
                                className={`${
                                  developerId === developer?.id
                                    ? "table-primary"
                                    : ""
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
                                  <strong>{developer?.name}</strong>
                                </td>
                                <td className="">{developer?.phone_number}</td>
                                <td className="">{developer?.email}</td>
                                <td className="">{developer?.address}</td>
                                <td className="">
                                  {developer?.total_script_count}
                                </td>
                                <td className="">
                                  {developer?.active_script_count}
                                </td>
                                <td className="">
                                  {developer?.maintain_script_count}
                                </td>
                                <td className="">{developer?.joining_date}</td>
                                <td className="">{developer?.status}</td>
                                <td>
                                  <div
                                    className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                    data-template="editOne"
                                    onClick={() =>
                                      editTDeveloperDetail(developer.id)
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
                                      deleteDeveloper(developer.id);
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
                        <ul className="pagination mb-0 ">
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

export default Developer;
