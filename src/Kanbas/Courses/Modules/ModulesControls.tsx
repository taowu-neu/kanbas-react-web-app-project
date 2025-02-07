import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import NullCheckmark from "./NullCheckmark";
import "./styles.css";

import ModuleEditor from "./ModuleEditor";

export default function ModulesControls({
  moduleName,
  setModuleName,
  addModule,
}: {
  moduleName: string;
  setModuleName: (title: string) => void;
  addModule: () => void;
}) {
  return (
    <div id="wd-modules-controls" className="text-nowrap">
      <button
        id="wd-add-module-btn"
        className="btn btn-lg btn-danger me-1 float-end"
        data-bs-toggle="modal"
        data-bs-target="#wd-add-module-dialog"
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Module
      </button>
      <div className="dropdown d-inline me-1 float-end" style={{ border: "none", boxShadow: "none", background: "none" }}>
        <button
          id="wd-publish-all-btn"
          className="btn btn-lg btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          style={{ marginLeft: '50px' }} 
        >
          <GreenCheckmark />
          Publish All
        </button>
        <ul className="dropdown-menu">
          <li>
            <a
              id="wd-publish-all-modules-and-items-btn"
              className="dropdown-item"
              href="http://a3--kanbas-react-web-app-tao-summer2-24.netlify.app/#/Kanbas/Dashboard"
            >
              <GreenCheckmark />
              Publish all modules and items
            </a>
          </li>
          <li>
            <a
              id="wd-publish-modules-only-button"
              className="dropdown-item"
              href="http://a3--kanbas-react-web-app-tao-summer2-24.netlify.app/#/Kanbas/Dashboard"
            >
              <GreenCheckmark />
              Publish modules only
            </a>
          </li>
          <li>
            <a
              id="wd-unpublish-all-modules-and-items"
              className="dropdown-item"
              href="http://a3--kanbas-react-web-app-tao-summer2-24.netlify.app/#/Kanbas/Dashboard"
            >
              <NullCheckmark />
              Unpublish all modules and items
            </a>
          </li>
          <li>
            <a
              id="wd-unpublish-modules-only"
              className="dropdown-item"
              href="http://a3--kanbas-react-web-app-tao-summer2-24.netlify.app/#/Kanbas/Dashboard"
            >
              <NullCheckmark />
              Unpublish modules only
            </a>
          </li>
        </ul>
      </div>
      <button
        id="wd-view-progress"
        className="btn btn-lg btn-secondary me-1 float-end"
        style={{ marginLeft: '0px' }} 
      > 
        View Progress
      </button>
      <button
        id="wd-collapse-all"
        className="btn btn-lg btn-secondary me-1 float-end"
        style={{ marginLeft: '300px' }} 
      >
        Collapse All
      </button>
      <ModuleEditor
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />
    </div>
  );
}
