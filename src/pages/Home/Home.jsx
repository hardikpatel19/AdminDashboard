import React, { useState } from "react";
import { BsListTask } from "react-icons/bs";
import { MdOutlineReviews } from "react-icons/md";
import { MdOutlineUpcoming } from "react-icons/md";
import { TbCalendarDue } from "react-icons/tb";
const Home = () => {
  const [dashboardCount] = useState([]);

  return (
    <div id="app-content">
      {/* Container fluid */}
      <div className="app-content-area">
        <div className=" pt-10 pb-21 mt-n11 mx-n4" />
        <div className="container-fluid mt-n23 ">
        <div className="container-fluid component p-0">
        <div className="row p-5 mb-0 ">
            <div className="col-12 col-md-6">
                <h2 className="text text-white mb-md-0 project">Projects</h2>
            </div>
            <div className="col-12 col-md-6 mb-4 text-md-end">
                <button className="btn btn-white btn-1 me-0 new">Create New Project</button>
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
                      <h4 className="mb-0">Projects</h4>
                    </div>
                    <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                      <TbCalendarDue size={20} />
                    </div>
                  </div>
                  {/* project number */}
                  <div className="lh-1">
                    <h1 className=" mb-1 fw-bold">{dashboardCount?.overdue_count?dashboardCount?.overdue_count:0}</h1>
                    <p className="mb-0">
                      <span className="text-dark me-2">2</span>Completed
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
                      <h4 className="mb-0">Active Task</h4>
                    </div>
                    <div
                      className="icon-shape icon-md bg-primary-soft text-primary
                rounded-2"
                    >
                      <BsListTask size={20} />
                    </div>
                  </div>
                  {/* project number */}
                  <div className="lh-1">
                    <h1 className="  mb-1 fw-bold">{dashboardCount?.ongoing_count?dashboardCount?.ongoing_count:0}</h1>
                    <p className="mb-0">
                      <span className="text-dark me-2">28</span>Completed
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
                      <h4 className="mb-0">Teams</h4>
                    </div>
                    <div
                      className="icon-shape icon-md bg-primary-soft text-primary
                rounded-2"
                    >
                      <MdOutlineReviews size={20} />
                    </div>
                  </div>
                  {/* project number */}
                  <div className="lh-1">
                    <h1 className="  mb-1 fw-bold">{dashboardCount?.under_review_count?dashboardCount?.under_review_count:0}</h1>
                    <p className="mb-0">
                      <span className="text-dark me-2">1</span>Completed
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
                      <h4 className="mb-0">Productivity</h4>
                    </div>
                    <div
                      className="icon-shape icon-md bg-primary-soft text-primary
                rounded-2"
                    >
                      <MdOutlineUpcoming size={20} />
                    </div>
                  </div>
                  {/* project number */}
                  <div className="lh-1">
                    <h1 className="  mb-1 fw-bold">{dashboardCount?.upcoming_count?dashboardCount?.upcoming_count:0}</h1>
                    <p className="mb-0">
                      <span className="text-dark me-2">1</span>Completed
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
              <td colSpan={5}><h4 className="mb-0">Active Projects</h4></td>
            </tr>
              <tr className="bg-primary-soft">
                <td >Project Name</td>
                <td >Hours</td>
                <td >Priority</td>
                <td > Members</td>
                <td >Progress</td>
              </tr>
            
              <tr>
                <td>
                <img
                    src="../assets/images/avatar/pn-1.png"
                    className="img-fluid"
                    alt="Imaged"
                  />
                  &nbsp; Dropbox Design system
                </td>
                <td>34</td>
                <td>Medium</td>
                <td> <img
                    src="../assets/images/avatar/tp-1.png"
                    className="img-fluid"
                    alt="Imaged"
                  /></td>
                <td>
                  15%
                  <progress value="15" max="100"></progress>
                </td>
              </tr>
              <tr>
                <td>
                <img
                    src="../assets/images/avatar/pn-2.png"
                    className="img-fluid"
                    alt="Imaged"
                  />
                  &nbsp; Stack Team design
                </td>
                <td>47</td>
                <td>High</td>
                <td> <img
                    src="../assets/images/avatar/tp-2.png"
                    className="img-fluid"
                    alt="Imaged"
                  /></td>
                <td>
                  35%
                  <progress value="35" max="100"></progress>
                </td>
              </tr>
              <tr>
                <td>
                <img
                    src="../assets/images/avatar/pn-3.png"
                    className="img-fluid"
                    alt="Imaged"
                  />
                  &nbsp; Gitdub Satellite
                </td>
                <td>120</td>
                <td>Low</td>
                <td> <img
                    src="../assets/images/avatar/tp-3.png"
                    className="img-fluid"
                    alt="Imaged"
                  /></td>
                <td>
                  75%
                  <progress value="75" max="100"></progress>
                </td>
              </tr>
              <tr>
                <td>
                <img
                    src="../assets/images/avatar/pn-4.png"
                    className="img-fluid"
                    alt="Imaged"
                  />
                  &nbsp; 3D Character Modeling
                </td>
                <td>89</td>
                <td>Medium</td>
                <td> <img
                    src="../assets/images/avatar/tp-4.png"
                    className="img-fluid"
                    alt="Imaged"
                  /></td>
                <td>
                  63%
                  <progress value="63" max="100"></progress>
                </td>
              </tr>
              <tr>
                <td>
                <img
                    src="../assets/images/avatar/pn-5.png"
                    className="img-fluid"
                    alt="Imaged"
                  />
                  &nbsp; Webapp Design System
                </td>
                <td>108</td>
                <td>Track</td>
                <td> <img
                    src="../assets/images/avatar/tp-5.png"
                    className="img-fluid"
                    alt="Imaged"
                  /></td>
                <td>
                  100%
                  <progress value="100" max="100"></progress>
                </td>
              </tr>
              <tr>
                <td>
                <img
                    src="../assets/images/avatar/pn-6.png"
                    className="img-fluid"
                    alt="Imaged"
                  />
                  &nbsp; Gitdub Event Design
                </td>
                <td>120</td>
                <td>Low</td>
                <td> <img
                    src="../assets/images/avatar/tp-5.png"
                    className="img-fluid"
                    alt="Imaged"
                  /></td>
                <td>
                  75%
                  <progress value="75" max="100"></progress>
                </td>
              </tr>
              <tr>
                <td colspan="5" className="text-center">
                  <button className="btn btn-primary">View All Projects</button>
                </td>
              </tr>
              </tbody>
          </table>
        </div>
        
                {/* table  */}
                <div class="table-responsive">
          <table class="table-2 table-hover">
              <tr>
                <td colspan="2">My Task</td>
                <td>
                  <button
                    class="btn btn-light btn-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Task
                  </button>
                </td>
              </tr>
              <tr class="bg-light">
                <td>Name</td>
                <td>Deadline</td>
                <td>Status</td>
              </tr>
            <tbody>
              <tr>
                <td>
                  <input type="checkbox" id="task1" name="task1" />
                  <label for="task1"> Design a FreshCart Home page</label>
                </td>
                <td>Today</td>
                <td>Approved</td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" id="task2" name="task2" />
                  <label for="task2"> Dash UI Dark Version Design</label>
                </td>
                <td>Yesterday</td>
                <td>Pending</td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" id="task3" name="task3" />
                  <label for="task3"> Dash UI landing page design</label>
                </td>
                <td>16 Sept, 2023</td>
                <td>In Progress</td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" id="task4" name="task4" />
                  <label for="task4"> Next.js Dash UI version</label>
                </td>
                <td>23 Sept, 2023</td>
                <td >Approved</td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" id="task5" name="task5" />
                  <label for="task5"> Develop a Dash UI Laravel</label>
                </td>
                <td>20 Sept, 2023</td>
                <td >Pending</td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" id="task6" name="task6" />
                  <label for="task6"> Coach home page design</label>
                </td>
                <td>12 Sept, 2023</td>
                <td >Approved</td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" id="task7" name="task7" />
                  <label for="task7"> Develop a Dash UI Laravel</label>
                </td>
                <td>11 Sept, 2023</td>
                <td >Pending</td>
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
