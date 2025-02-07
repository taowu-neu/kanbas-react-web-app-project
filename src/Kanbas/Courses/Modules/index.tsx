import { BsGripVertical } from "react-icons/bs";
import { useParams } from "react-router";

import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import React, { useState, useEffect } from "react";

import {
  setModules,
  addModule,
  editModule,
  updateModule,
  deleteModule,
} from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import * as client from "./client";
export default function Modules() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();

  const createModule = async (module: any) => {
    const newModule = await client.createModule(cid as string, module);
    dispatch(addModule(newModule));
  };
  const removeModule = async (moduleId: string) => {
    await client.deleteModule(moduleId);
    dispatch(deleteModule(moduleId));
  };
  const saveModule = async (module: any) => {
    const status = await client.updateModule(module);
    console.log(status);
    dispatch(updateModule(module));
  };
  useEffect(() => {
    const fetchModules = async () => {
      const modules = await client.findModulesForCourse(cid as string);
      dispatch(setModules(modules));
    };

    fetchModules();
  }, [cid, dispatch]);
  return (
    <div className="d-flex">
    <div className="wd-alls">
      { (currentUser.role === "FACULTY" || currentUser.role === "ADMIN") && (
        <ModulesControls
          setModuleName={setModuleName}
          moduleName={moduleName}
          addModule={() => {
            createModule({ name: moduleName, course: cid });
            setModuleName("");
          }}
      />)}
      <ul id="wd-modules" className="list-group rounded-0">
        {modules
          .filter((module: any) => module.course === cid)
          .map((module: any) => (
            <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />
                {!module.editing && module.name}
                {module.editing && (
                  <input
                    className="form-control w-50 d-inline-block"
                    onChange={(e) =>
                      saveModule({ ...module, name: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveModule({ ...module, editing: false });
                      }
                    }}
                    value={module.name}
                  />
                )}
                { (currentUser.role === "FACULTY" || currentUser.role === "ADMIN") && (
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId) => {
                    removeModule(moduleId);
                  }}
                  editModule={(moduleId) => dispatch(editModule(moduleId))}
                />)}
              </div>
              {module.lessons && (
                <ul className="wd-lessons list-group rounded-0">
                  {module.lessons.map((lesson: any) => (
                    <li className="wd-lesson list-group-item p-3 ps-1">
                      <BsGripVertical className="me-2 fs-3" />
                      {lesson.name}
                      { (currentUser.role === "FACULTY" || currentUser.role === "ADMIN") && (
                      <LessonControlButtons />)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
    </div>
    </div>
  );
}
