import React, { useState } from "react";
import { BsListTask } from "react-icons/bs";
import { MdOutlineReviews } from "react-icons/md";
import { MdOutlineUpcoming } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { TbCalendarDue } from "react-icons/tb";

const Home = () => {
  const [dashboardCount] = useState([]);
const navigate = useNavigate();

  return (
    <div id="app-content">
      {/* Container fluid */}
      <div className="app-content-area">
        <div className=" pt-10 pb-21 mt-n11 mx-n4" />
        <div className="container-fluid mt-n23 ">
        <div className="container-fluid component p-0">
        <div className="row p-5 mb-0 ">
            <div className="col-12 col-md-6">
                <h2 className="text text-white mb-md-0 ms-1 project">Script</h2>
            </div>
            <div className="col-12 col-md-6 mb-4 text-md-end">
                <button className="btn btn-white btn-1 me-0 new"
                onClick={() => navigate("/add/script")}>Add New Script</button>
            </div>
        </div>
    </div>
          <div className="row card-1">
            <div className="col-xl-3 col-lg-6 col-md-12 mt-n11 col-12 mb-12">
              {/* card */}
              <div className="card h-70 card-lift">
                {/* card body */}
                <div className="card-body">
                  {/* heading */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="mb-0">Active Script</h4>
                    </div>
                    <div className="icon-shape icon-md bg-primary-soft  rounded-2">
                      <TbCalendarDue size={20} />
                    </div>
                  </div>
                  {/* project number */}
                  <div className="lh-1">
                    <h1 className=" mb-1 fw-bold">{dashboardCount?.overdue_count?dashboardCount?.overdue_count:18}</h1>
                    <p className="mb-0">
                      <span className="text-dark me-2"></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 col-md-12 mt-n11 col-12 mb-12">
              {/* card */}
              <div className="card h-70 card-lift">
                {/* card body */}
                <div className="card-body">
                  {/* heading */}
                  <div
                    className="d-flex justify-content-between align-items-center
              mb-3"
                  >
                    <div>
                      <h4 className="mb-0">In Maintenance</h4>
                    </div>
                    <div
                      className="icon-shape icon-md bg-primary-soft 
                rounded-2"
                    >
                      <BsListTask size={20} />
                    </div>
                  </div>
                  {/* project number */}
                  <div className="lh-1">
                    <h1 className="  mb-1 fw-bold">{dashboardCount?.ongoing_count?dashboardCount?.ongoing_count:132}</h1>
                    <p className="mb-0">
                      <span className="text-dark me-2"></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 col-md-12 mt-n11 col-12 mb-12">
              {/* card */}
              <div className="card h-70 card-lift">
                {/* card body */}
                <div className="card-body">
                  {/* heading */}
                  <div
                    className="d-flex justify-content-between align-items-center
              mb-3"
                  >
                    <div>
                      <h4 className="mb-0">In Development</h4>
                    </div>
                    <div
                      className="icon-shape icon-md bg-primary-soft 
                rounded-2"
                    >
                      <MdOutlineReviews size={20} />
                    </div>
                  </div>
                  {/* project number */}
                  <div className="lh-1">
                    <h1 className="  mb-1 fw-bold">{dashboardCount?.under_review_count?dashboardCount?.under_review_count:12}</h1>
                    <p className="mb-0">
                      <span className="text-dark me-2"></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 col-md-12 mt-n11 col-12 mb-12">
              {/* card */}
              <div className="card h-70 card-lift">
                {/* card body */}
                <div className="card-body">
                  {/* heading */}
                  <div
                    className="d-flex justify-content-between align-items-center
              mb-3"
                  >
                    <div>
                      <h4 className="mb-0">Pending Payment </h4>
                    </div>
                    <div
                      className="icon-shape icon-md bg-primary-soft 
                rounded-2"
                    >
                      <MdOutlineUpcoming size={20} />
                    </div>
                  </div>
                  {/* project number */}
                  <div className="lh-1">
                    <h1 className="  mb-1 fw-bold">{dashboardCount?.upcoming_count?dashboardCount?.upcoming_count:76}</h1>
                    <p className="mb-0">
                      <span className="text-dark me-2"></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* row  */}

                {/* table  */}
                <div className="table-responsive">
          <table className="table table-hover">
            <tbody>
            <tr>
              <td colSpan={5}><h4 className="mb-1 text-start">Script</h4></td>
            </tr>
              <tr className="bg-primary-soft">
                <td >No</td>
                <td >Script name</td>
                <td >Date of Development</td>
                <td > Status</td>
                <td >Developer Name</td>
              </tr>
            
              <tr>
                <td>
                1.
                </td>
                <td>World Bank</td>
                <td>13/12/2024</td>
                <td> Active</td>
                <td>
                Meet  velani
                </td>
              </tr>
              <tr>
                <td>
               2.
                </td>
                <td>World Bank</td>
                <td>13/12/2024</td>
                <td> Active</td>
                <td>
                Meet  velani
                </td>
              </tr>
              <tr>
                <td>
                3.
                </td>
                <td>World Bank</td>
                <td>13/12/2024</td>
                <td> Active</td>
                <td>
                Meet  velani
                </td>
              </tr>
              <tr>
                <td>
                4.
                </td>
                <td>World Bank</td>
                <td>13/12/2024</td>
                <td> Active</td>
                <td>
                Meet  velani
                </td>
              </tr>
              <tr>
                <td>
                5.
                </td>
                <td>World Bank</td>
                <td>13/12/2024</td>
                <td> Active</td>
                <td>
                Meet  velani
                </td>
              </tr>
              <tr>
                <td>
                6.
                </td>
                <td>World Bank</td>
                <td>13/12/2024</td>
                <td> Active</td>
                <td>
                Meet  velani
                </td>
              </tr>
              <tr>
                <td colspan="5" className="text-center">
                  <button className="btn btn-primary"
                  onClick={() => navigate("/script")}>View All Script</button>
                </td>
              </tr>
              </tbody>
          </table>
        </div>
        

        </div>
      </div>
    </div>
  );
};

export default Home;
