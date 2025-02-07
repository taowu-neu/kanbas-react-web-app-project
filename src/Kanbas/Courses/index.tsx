import CoursesNavigation from "./Navigation";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import Grades from "./Grades";
import PeopleTable from "./People/Table";
import { FaAlignJustify } from "react-icons/fa6";
import Quizzes from "./Quizzes";
import QuizEditor from "./Quizzes/Editor";
import QuizPreview from "./Quizzes/Preview";
import QuizTake from "./Quizzes/TakeQuiz";

export default function Courses({ courses }: { courses: any[] }) {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name} &gt; {pathname.split("/")[4]}
      </h2>
      <hr />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <CoursesNavigation />
        <div className="wd-courses-content">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/Editor" element={<AssignmentEditor />} />
            <Route
              path="Assignments/Editor/:aid"
              element={<AssignmentEditor />}
            />
            {/* Routes */}
            <Route path="Quizzes" element={<Quizzes />} />
            <Route path="Quizzes/Editor" element={<QuizEditor />} />
            <Route path="Quizzes/Editor/:qid" element={<QuizEditor />} />
            <Route path="Quizzes/Preview/:qid" element={<QuizPreview />} />
            <Route path="Quizzes/TakeQuiz/:qid" element={<QuizTake />} />

            <Route path="Grades" element={<Grades />} />
            <Route path="People" element={<PeopleTable />} />
            <Route path="People/:uid" element={<PeopleTable />} />
          </Routes>
        </div>
      </div>

    </div>
  );
}
