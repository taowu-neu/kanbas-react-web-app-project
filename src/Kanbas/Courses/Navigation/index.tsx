import { useLocation, useParams } from "react-router-dom";
import "./index.css";

const links = [
  "Home",
  "Modules",
  "Piazza",
  "Zoom",
  "Assignments",
  "Quizzes",
  "Grades",
  "People",
];

export default function CoursesNavigation() {
  const location = useLocation();
  const { cid } = useParams<{ cid: string }>();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div id="wd-courses-navigation" className="list-group fs-5 rounded-0">
      {links.map((link) => {
        const linkPath = `/Kanbas/Courses/${cid}/${link}`;
        return (
          <a
            key={link}
            href={`#${linkPath}`}
            className={`list-group-item ${
              isActive(linkPath) ? "active" : ""
            } border border-0`}
          >
            {link}
          </a>
        );
      })}
    </div>
  );
}
