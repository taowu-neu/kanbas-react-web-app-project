import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./styles.css";
import { useDispatch } from "react-redux";
import { setEditingAssignment, clearEditingAssignment } from "./reducer";
import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getAssignments, deleteAssignment } from "./client";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  points: number;
  dueDate: string;
  availableFrom: string;
  availableUntil: string;
  course: string;
}

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentToDelete, setAssignmentToDelete] =
    useState<Assignment | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      const data = await getAssignments(cid!);
      setAssignments(data);
    };

    fetchAssignments();
  }, [cid]);

  const handleDelete = async () => {
    if (assignmentToDelete) {
      await deleteAssignment(assignmentToDelete._id);
      setAssignments(
        assignments.filter((a) => a._id !== assignmentToDelete._id)
      );
      setAssignmentToDelete(null);
    }
  };

  return (
    <div id="wd-assignments" className="container mt-4">
      <div
        id="wd-assignments-controls"
        className="d-flex justify-content-between align-items-center mb-3"
      >
        <div className="position-relative">
          <input
            id="wd-search-assignment"
            className="form-control"
            placeholder="Search..."
          />
        </div>
        <div>
          <button
            id="wd-add-assignment-group"
            className="btn btn-secondary me-2"
          >
            Group
          </button>
          <button
            id="wd-add-assignment"
            className="btn btn-danger"
            onClick={() => {
              dispatch(clearEditingAssignment());
              navigate(`/Kanbas/Courses/${cid}/Assignments/Editor`);
            }}
          >
            + Assignment
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3 wd-assignments-title-item">
        <h3 id="wd-assignments-title" className="mb-0">
          ASSIGNMENTS
        </h3>
        <div className="circle-container">
          <span className="badge bg-light text-dark">40% of Total</span>
        </div>
      </div>
      <ul id="wd-assignment-list" className="list-unstyled">
        {assignments
          .filter((assignment: Assignment) => assignment.course === cid)
          .map((assignment: Assignment) => (
            <li
              key={assignment._id}
              className="wd-assignment-list-item border-start border-success border-3 ps-3 mb-3 d-flex align-items-start"
            >
              <div className="assignment-details">
                <div className="first-line">
                  <Link
                    to={`/Kanbas/Courses/${cid}/Assignments/Editor/${assignment._id}`}
                    className="wd-assignment-link text-decoration-none"
                    onClick={() => dispatch(setEditingAssignment(assignment))}
                  >
                    {assignment.title}
                  </Link>
                </div>
                <div className="second-line text-muted">
                  <span>Multiple Modules</span> |{" "}
                  <span>
                    <b>Not available until</b> | {assignment.availableFrom}
                  </span>
                </div>
                <div className="third-line text-muted">
                  <span>
                    <b>Due</b> {assignment.dueDate}
                  </span>{" "}
                  | <span>{assignment.points}pts</span>
                </div>
              </div>
              <FaTrash
                className="text-danger ms-auto"
                onClick={() => setAssignmentToDelete(assignment)}
                style={{ cursor: "pointer" }}
              />
            </li>
          ))}
      </ul>

      {assignmentToDelete && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Assignment</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setAssignmentToDelete(null)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this assignment?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setAssignmentToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
