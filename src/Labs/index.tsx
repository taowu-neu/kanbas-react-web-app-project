import Lab1 from "./Lab1";
import { Route, Routes, Navigate } from "react-router";
import TOC from "./TOC";
import Lab2 from "./Lab2";
import Lab3 from "./Lab3";
import Lab4 from "./Lab4";
import Lab5 from "./Lab5";
import store from "./store";
import { Provider } from "react-redux";
import Lab6 from "./Lab6";

export default function Labs() {
  return (
    <Provider store={store}>
      <div id="wd-labs">
        <h1>Labs</h1>
        <h3>Full name: Tao Wu </h3>
        <div>
          {" "}
          <a href="https://github.com/tao0024/kanbas-react-web-app">
            {" "}
            Github Link
          </a>
        </div>
        <TOC />
        <Routes>
          <Route path="/" element={<Navigate to="Lab1" />} />
          <Route path="Lab1" element={<Lab1 />} />
          <Route path="Lab2" element={<Lab2 />} />
          <Route path="Lab3/*" element={<Lab3 />} />
          <Route path="Lab4/*" element={<Lab4 />} />
          <Route path="Lab5/*" element={<Lab5 />} />
          <Route path="Lab6/*" element={<Lab6 />} />
        </Routes>
      </div>
    </Provider>
  );
}
