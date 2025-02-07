import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearEditingAssignment, setEditingAssignment } from "./reducer";
import { createAssignment, updateAssignment, getAssignments } from "./client";
import "./editor.css";

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

export default function AssignmentEditor() {
  const { aid, cid } = useParams<{ aid?: string; cid?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { editingAssignment } = useSelector(
    (state: any) => state.assignmentsReducer
  );
  const [assignment, setAssignment] = useState<Assignment>({
    _id: "",
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableFrom: "",
    availableUntil: "",
    course: cid || "",
  });

  useEffect(() => {
    const fetchAssignment = async () => {
      if (aid) {
        const assignments = await getAssignments(cid!);
        const currentAssignment = assignments.find(
          (a: Assignment) => a._id === aid
        );
        if (currentAssignment) {
          dispatch(setEditingAssignment(currentAssignment));
        }
      }
    };

    fetchAssignment();
  }, [aid, cid, dispatch]);

  useEffect(() => {
    if (editingAssignment) {
      setAssignment(editingAssignment);
    }
  }, [editingAssignment]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAssignment((prevAssignment) => ({
      ...prevAssignment,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (aid) {
      await updateAssignment(assignment);
      dispatch(clearEditingAssignment());
      navigate(`/Kanbas/Courses/${cid}/Assignments`);
    } else {
      const newAssignment = await createAssignment(cid!, {
        ...assignment,
        course: cid!,
      }
      );
      console.log(newAssignment);
      dispatch(clearEditingAssignment());
      navigate(`/Kanbas/Courses/${cid}/Assignments`, { replace: true });
    }
  
  };

  const handleCancel = () => {
    dispatch(clearEditingAssignment());
    navigate(`/Kanbas/Courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="container mt-4">
      <div className="row mb-3">
        <label htmlFor="wd-name" className="col-sm-2 col-form-label">
          Name
        </label>
        <div className="col-sm-10">
          <input
            id="wd-name"
            className="form-control"
            name="title"
            value={assignment.title}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="wd-description" className="col-sm-2 col-form-label">
          Description
        </label>
        <div className="col-sm-10">
          <textarea
            id="wd-description"
            className="form-control"
            name="description"
            value={assignment.description}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="wd-points" className="col-sm-2 col-form-label">
          Points
        </label>
        <div className="col-sm-10">
          <input
            id="wd-points"
            className="form-control"
            name="points"
            type="number"
            value={assignment.points}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="wd-dueDate" className="col-sm-2 col-form-label">
          Due Date
        </label>
        <div className="col-sm-10">
          <input
            id="wd-dueDate"
            className="form-control"
            name="dueDate"
            type="date"
            value={assignment.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="wd-availableFrom" className="col-sm-2 col-form-label">
          Available From
        </label>
        <div className="col-sm-10">
          <input
            id="wd-availableFrom"
            className="form-control"
            name="availableFrom"
            type="date"
            value={assignment.availableFrom}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="wd-availableUntil" className="col-sm-2 col-form-label">
          Available Until
        </label>
        <div className="col-sm-10">
          <input
            id="wd-availableUntil"
            className="form-control"
            name="availableUntil"
            type="date"
            value={assignment.availableUntil}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-10 offset-sm-2">
          <button className="btn btn-danger me-2" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
