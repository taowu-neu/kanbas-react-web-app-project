import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const signin = async () => {
    try {
      const currentUser = await client.signin(credentials);
    //   const currentUser = {
    //     username: "test",
    //     password: "123",
    //     role:"USER",
    //     enrol: [{
    //     "_id": "RS101",
    //     "name": "Rocket Propulsion",
    //     "number": "RS4550",
    //     "startDate": "2023-01-10",
    //     "endDate": "2023-05-15",
    //     "department": "D123",
    //     "credits": 4,
    //     "description": "This course provides an in-depth study of the fundamentals of rocket propulsion, covering topics such as propulsion theory, engine types, fuel chemistry, and the practical applications of rocket technology. Designed for students with a strong background in physics and engineering, the course includes both theoretical instruction and hands-on laboratory work",
    //     "image": "/images/1.png"
    // },
    // {
    //     "_id": "RS102",
    //     "name": "Aerodynamics",
    //     "number": "RS4560",
    //     "startDate": "2023-01-10",
    //     "endDate": "2023-05-15",
    //     "department": "D123",
    //     "credits": 3,
    //     "description": "This course offers a comprehensive exploration of aerodynamics, focusing on the principles and applications of airflow and its effects on flying objects. Topics include fluid dynamics, airfoil design, lift and drag forces, and the aerodynamic considerations in aircraft design. The course blends theoretical learning with practical applications, suitable for students pursuing a career in aeronautics or astronautics engineering.",
    //     "image": "/images/2.jpg"
    // },
    // {
    //     "_id": "RS103",
    //     "name": "Spacecraft Design",
    //     "number": "RS4570",
    //     "startDate": "2023-01-10",
    //     "endDate": "2023-05-15",
    //     "department": "D123",
    //     "credits": 4,
    //     "description": "This course delves into the principles and practices of spacecraft design, offering students a detailed understanding of the engineering and technology behind spacecraft systems. Key topics include spacecraft structure, propulsion, power systems, thermal control, and payload integration. Emphasizing both theoretical concepts and practical skills, the course prepares students for careers in the space industry, with a focus on innovative design and problem-solving in the context of current and future space missions",
    //     "image": "/images/3.jpg"
    // }]
    //   }
      dispatch(setCurrentUser(currentUser));
      navigate("/Kanbas/Account/Profile");
    } catch (err: any) {
      setError(err.response.data.message);
    }
  };
  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      {error && <div className="wd-error alert alert-danger">{error}</div>}

      <input
        id="wd-username"
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        value={credentials.username}
        className="form-control mb-2"
        placeholder="username"
      />
      <input
        id="wd-password"
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        value={credentials.password}
        className="form-control mb-2"
        placeholder="password"
        type="password"
      />
      <button
        id="wd-signin-btn"
        onClick={signin}
        className="btn btn-primary w-100"
      >
        {" "}
        Sign in{" "}
      </button>
      <br />
      <Link id="wd-signup-link" to="/Kanbas/Account/Signup">
        Sign up
      </Link>
    </div>
  );
}
