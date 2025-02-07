import React, { useState } from "react";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;

export default function WorkingWithModule() {
  const [myModule, setModule] = useState({
    id: 2,
    name: "kobe",
    description: "NBA",
    course: "123",
  });

  const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`;

  return (
    <div id="wd-working-with-module">
      <h3>Module</h3>
      <hr />
      <h4>Get Module</h4>
      <a
        id="wd-retrieve-module"
        className="btn btn-primary"
        href={`${REMOTE_SERVER}/lab5/module/`}
      >
        Get Object
      </a>
      <hr />

      <h4>Get Module Name</h4>
      <a
        id="wd-retrieve-module"
        className="btn btn-primary"
        href={`${REMOTE_SERVER}/lab5/module/name`}
      >
        Get Module Name
      </a>
      <hr />

      <h4>Modifying Properties</h4>
      <a
        id="wd-update-module-name"
        className="btn btn-primary float-end"
        href={`${MODULE_API_URL}/name/${myModule.name}`}
      >
        Update Module
      </a>
      <input
        className="form-control w-75"
        id="wd-module-name"
        value={myModule.name}
        onChange={(e) => {
          setModule({ ...myModule, name: e.target.value });
        }}
      />
    </div>
  );
}
