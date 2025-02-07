import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {FaCog, FaDownload, FaFilter, FaUpload} from "react-icons/fa";
import "./grades.css";
import db from "../../Database";
import {useParams} from "react-router-dom";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
}

interface Enrollment {
    _id: string;
    user: string;
    course: string;
}

interface Assignment {
    _id: string;
    title: string;
    course: string;
    description?: string;
}

interface Grade {
    _id: string;
    student: string;
    assignment: string;
    grade: string;
}

const Grades: React.FC = () => {
    const {cid} = useParams<{ cid?: string }>();
    const [selectedCourse, setSelectedCourse] = useState<string | null>(cid || null);
    const [students, setStudents] = useState<User[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);

    useEffect(() => {
        const enrollments = db.enrollments.filter((enrollment: Enrollment) => enrollment.course === selectedCourse);
        const studentIds = enrollments.map((enrollment: Enrollment) => enrollment.user);

        const studentData = db.users.filter((user: User) => studentIds.includes(user._id));

        const assignmentData = db.assignments
            .filter((assignment: any) => assignment.course === selectedCourse)
            .map((assignment: any) => ({
                _id: assignment._id,
                title: assignment.title,
                course: assignment.course,
                description: assignment.description,
            }));

        const assignmentIds = assignmentData.map((assignment) => assignment._id);
        const gradeData = db.grades.filter((grade: Grade) =>
            studentIds.includes(grade.student) && assignmentIds.includes(grade.assignment)
        );

        setStudents(studentData);
        setAssignments(assignmentData);
        setGrades(gradeData);

        setSelectedCourse(selectedCourse);
    }, [selectedCourse]);

    return (
        <div className="All">
            <div className="container mt-4">
                <div className="row mb-3">
                    <div className="col-md-12 text-end">
                        <button className="btn btn-light text-dark me-2">
                            <FaUpload/> Import
                        </button>
                        <button className="btn btn-light text-dark me-2">
                            <FaDownload/> Export
                        </button>
                        <button className="btn btn-light text-dark">
                            <FaCog/>
                        </button>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col text-start">
                        <button className="btn btn-light text-dark">
                            <FaFilter/> Apply Filter
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th style={{width: "30%"}}>
                                <b>Student Name</b>
                            </th>
                            {assignments.map((assignment) => (
                                <th key={assignment._id} style={{width: `${70 / assignments.length}%`}}>
                                    {assignment.title}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student, index) => (
                            <tr
                                key={student._id}
                                className={index % 2 === 0 ? "table-light" : "table-secondary"}
                            >
                                <td className="text-danger">{student.firstName} {student.lastName}</td>
                                {assignments.map((assignment) => {
                                    const grade = grades.find(
                                        (g) => g.student === student._id && g.assignment === assignment._id
                                    );
                                    return (
                                        <td key={assignment._id} className="text-center">
                                            {grade ? grade.grade : "N/A"}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Grades;
