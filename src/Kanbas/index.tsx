import Dashboard from "./Dashboard";
import KanbasNavigation from "./Navigation";
import { Navigate, Route, Routes } from "react-router";
import Courses from "./Courses";
import "./styles.css";
import * as client from "./Courses/client";
import { useState } from "react";
import store from "./store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import Account from "./Account";
import ProtectedRoute from "./ProtectedRoute";

export default function Kanbas() {
  const [courses, setCourses] = useState<any[]>([]);
  const fetchCourses = async () => {
    const courses = await client.fetchAllCourses();
    setCourses(courses);
  };

  const [course, setCourse] = useState<any>({
    number: "1234",
    name: "New Course",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    department: "123",
    credits: "123",
    description: "123",
    updateAt: "123",
  });
  const addNewCourse = async () => {
    const uniqueNumber = Date.now().toString();
    const newCourse = await client.createCourse({
      ...course,
      number: uniqueNumber,
    });
    setCourses([...courses, newCourse]);
  };

  const deleteCourse = async (courseId: any) => {
    await client.deleteCourse(courseId);
    setCourses(courses.filter((course) => course.number !== courseId));
  };
  const updateCourse = async () => {
    console.log("Update button clicked");
    const updatedCourse = await client.updateCourse(course);
    console.log("Updated Course:", updatedCourse);
    
    setCourses(prevCourses => {
      const newCourses = prevCourses.map(c => 
        c.number === updatedCourse.number ? updatedCourse : c
      );
      console.log("Updated Courses Array:", newCourses);
      return newCourses;
    });
  };
  
  
  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <Provider store={store}>
      <div id="wd-kanbas" className="h-100">
        <div className="d-flex h-100">
          <div className="d-none d-md-block bg-black min-vh-100">
            <KanbasNavigation />
          </div>

          <div className="wd-main-content-offset p-0 flex-grow-1">
            <Routes>
              <Route path="/" element={<Navigate to="Dashboard" />} />
              <Route path="/Account/*" element={<Account />} />
              <Route
                path="Dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard
                      courses={courses}
                      course={course}
                      setCourse={setCourse}
                      addNewCourse={addNewCourse}
                      deleteCourse={deleteCourse}
                      updateCourse={updateCourse}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="Courses/:cid/*"
                element={
                  <ProtectedRoute>
                    <Courses courses={courses} />
                  </ProtectedRoute>
                }
              />
              <Route path="Calendar" element={<h1>Calendar</h1>} />
              <Route path="Inbox" element={<h1>Inbox</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </Provider>
  );
}
