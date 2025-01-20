import React, { useEffect, useRef, useCallback, useState } from "react";
import { MdOutlineDelete, MdOutlineVisibility } from "react-icons/md";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import { useStateValue } from "../../../../StateProvider";
import { ConfirmationModal } from "../../../../components/Modals/ConfirmationModal";
import { ITEMS_PER_PAGE } from "../../../../Constants";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteScriptDetail, getScript } from "../../../../apiCall";

const ScriptList = () => {
  const [confirmationShow, setConfirmationShow] = useState(false);
  const [funHandler, setFunHandler] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [scriptList, setScriptList] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [, dispatch] = useStateValue();
  const [filteredData, setFilteredData] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const navigate = useNavigate();

  const searchInput = useRef(null);
  const location = useLocation();
  const viewFile = (id) => {
    console.log("View file with ID:", id);
    // Add logic to view the file, such as opening a modal or navigating to another page
  };
  const searchParams = new URLSearchParams(location.search);
  const scriptId = searchParams.get("Script_id");
  // const deleteData = async (docId) => {
  //   try {
  //     const docRef = doc(db, "scriptDetail", docId);
  //     const re = await deleteDoc(docRef);
  //     console.log(re);
  //     refetch();
  //     toast.success("Document deleted successfully");
  //   } catch (error) {
  //     toast.error("Error deleting document: ", error);
  //   }
  // };
  const editTScriptDetail = (id) => {
    navigate(`/update/script/${id}`);
  };
  const fetchScriptList = async (pageNumber) => {
    try {
      const response = await getScript(pageNumber);
      console.log(response);

      if (response?.status === 200) {
        console.log(response?.data?.data);
        // console.log(Math.ceil(response?.data?.data.length/ 10));
        setTotalRecords(response?.data?.data.count);
        setTotalPages(Math.ceil(response?.data?.data.count / 10));
        setScriptList(response?.data?.data?.data);
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
    queryKey: ["script-list", currentPage],
    queryFn: () => fetchScriptList(currentPage),
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
      let filtered = scriptList;

      if (query) {
        filtered = filtered.filter((item) =>
          item.Name.toLowerCase().includes(query.toLowerCase())
        );
      }
      // setFilteredData(filtered);
      // setCurrentItems(filtered);
    },
    [scriptList] // Add dependencies here
  );
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const removeSelection = () => {
    navigate("/script");
  };
  useEffect(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const totalPageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    if (totalPageCount !== 0 && totalPageCount < currentPage) {
      // setCurrentPage(totalPageCount);
    }
  }, [currentPage, filteredData]);

  useEffect(() => {
    console.log(scriptId, filteredData);
    if (scriptId && filteredData.length > 0) {
      const targetIndex = filteredData.findIndex(
        (item) => item.ID === parseInt(scriptId)
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

  const deleteScript = async (scriptId) => {
    dispatch({ type: "SET_LOADING", status: true });
    const response = await deleteScriptDetail(scriptId);
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
                  <h3 className="mb-0  ">Script List</h3>
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
                        onClick={() => navigate("/add/script")}
                      >
                        + Add Script
                      </div>
                    </div>
                  </div>
                  <>
                    <div className="row justify-content-end">
                      <div className=" col-lg-3 col-md-6 mt-md-1 d-flex">
                        <label className="mt-3 me-2 form-label">Search</label>
                        <input
                          ref={searchInput}
                          type="search"
                          className="form-control "
                          // value={searchQuery}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              handleSearch();
                            }
                          }}
                          placeholder=""
                        />
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
                          <thead className="table-light ">
                            <tr className="text-center">
                              <th>No</th>
                              <th>Script Name</th>
                              <th>Country</th>
                              <th>Development Date</th>
                              <th>Developer Name</th>
                              <th>Big Ref No</th>
                              <th>Status</th>
                              <th>Script type</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {currentItems.map((script, index) => (
                              <tr
                                id={`user-${index}`}
                                className={`${
                                  scriptId === script?.id ? "table-primary" : ""
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
                                  <strong>{script?.script_name}</strong>
                                </td>
                                <td className="">{script?.country}</td>
                                <td className="">{script?.development_date}</td>
                                <td className="">{script?.bigref_no}</td>
                                <td>
                                  <div className="truncate">
                                    {script?.developer_id}
                                  </div>
                                </td>
                                <td className="">{script?.status?"Active":"Inactive"}</td>
                                <td className="">{script?.script_type}</td>

                                <td>
                                  <div
                                    className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                    data-template="viewOne"
                                    onClick={() => viewFile(script.id)}
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
                                      editTScriptDetail(script._id)
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
                                      deleteScript(script._id);
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

export default ScriptList;
