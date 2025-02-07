import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../Account/reducer";
import * as client from '../Account/client';


interface Course {
  _id: string,
  name: string,
  number: string,
  startDate: string,
  endDate: string,
  department: string,
  credits: number,
  description: string,
  image: string,
}

export default function Dashboard({
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse,
}: {
  courses: any[];
  course: any;
  setCourse: (course: any) => void;
  addNewCourse: () => void;
  deleteCourse: (course: any) => void;
  updateCourse: () => void;
}) {
  const dispatch = useDispatch();
  const [enrolPage, setEnrolPage] = useState(false);
  const UpdateEnrolPage = () => {
    setEnrolPage(!enrolPage);
  }

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  useEffect(() => {
    console.log("Dashboard received updated courses:", courses);
  }, [courses]);

  // Function to add a course to the current user
  const addCourseToUser = async (courseToAdd: any) => {
    if (currentUser && Array.isArray(currentUser.enrol)) {
      const updatedEnrol = [...currentUser.enrol, courseToAdd];
      // eslint-disable-next-line
      const updatedUser = { ...currentUser, enrol: updatedEnrol };
      try {
        
        const updatedUserInfo = await client.updateUser(currentUser._id, { enrol: updatedEnrol });
        
        if (updatedUserInfo) {
          dispatch(setCurrentUser(updatedUserInfo));
        } else {
          console.error("Update user failed, no user info returned from the backend.");
        }
      } catch (error) {
        console.error("Failed to update user courses", error);
      }
    }
  };
  
  const enrolledCourses = courses.filter(course =>
    currentUser.enrol.some((enrolledCourse: any) => enrolledCourse.number === course.number)
  );
  

  // Console logs to check current user information
  // console.log("In the Dashboard Page, Check User Information: ", currentUser);
  // console.log("Enrolled courses:", currentUser && currentUser.enrol ? currentUser.enrol : "No courses enrolled");

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      { (currentUser.role === "FACULTY" || currentUser.role === "ADMIN") && (
        <>
        <h5>
        New Course
        <button
          className="btn btn-primary float-end"
          id="wd-add-new-course-click"
          onClick={addNewCourse}
        >
          {" "}
          Add{" "}
        </button>

        <button
        className="btn btn-warning float-end me-2"
        onClick={updateCourse}
        id="wd-update-course-click"
      >
        Update
      </button>

      </h5>
      <br />
      <input
        value={course.name}
        className="form-control mb-2"
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
      />
      <textarea
        value={course.description}
        className="form-control"
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
      />
      <hr />
      </>
      )}

      <div className="d-flex justify-content-between">
        <h2 id="wd-dashboard-published">Enrolled Courses ({currentUser && currentUser.enrol ? currentUser.enrol.length : 0})</h2>
        <button
          className="btn btn-primary float-end"
          onClick={UpdateEnrolPage}
        >
          Enrol
        </button>
      </div>
      {enrolPage && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header justify-content-between">
                <h5 className="modal-title">Click Any Course to Enrol</h5>
                <button
                  type="button"
                  className="close"
                  onClick={UpdateEnrolPage}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {courses.map((course) => (
                  <button
                    key={course._id}
                    onClick={() => addCourseToUser(course)}
                  >
                    {course.number + " - " + course.name}
                  </button>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={UpdateEnrolPage}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <hr />
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {enrolledCourses.map((course: Course) => (
            <div className="wd-dashboard-course col" style={{ width: "300px" }} key={course._id}>
              <Link
                to={`/Kanbas/Courses/${course.number}/Home`}
                className="text-decoration-none"
              >
                <div className="card rounded-3 overflow-hidden">
                  <img
                    src={`/images/reactjs.jpg`}  
                    alt={course.name}
                    height="160"
                  />
                  <div className="card-body">
                    <span
                      className="wd-dashboard-course-link"
                      style={{
                        textDecoration: "none",
                        color: "navy",
                        fontWeight: "bold",
                      }}
                    >
                      {course.name}
                    </span>
                    <p
                      className="wd-dashboard-course-title card-text"
                      style={{ maxHeight: 53, overflow: "hidden" }}
                    >
                      {course.description}
                    </p>
                    <Link
                      to={`/Kanbas/Courses/${course.number}/Home`}
                      className="btn btn-primary"
                    >
                      Go
                    </Link>
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        deleteCourse(course);
                      }}
                      className="btn btn-danger float-end"
                      id="wd-delete-course-click"
                    >
                      Delete
                    </button>
                    {(currentUser.role === "FACULTY" || currentUser.role === "ADMIN") && (
                      <button
                        id="wd-edit-course-click"
                        onClick={(event) => {
                          event.preventDefault();
                          setCourse(course);
                        }}
                        className="btn btn-warning me-2 float-end"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
