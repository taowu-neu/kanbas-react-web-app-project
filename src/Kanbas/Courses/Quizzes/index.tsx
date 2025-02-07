import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./styles.css";
import { setEditingQuiz, deleteQuiz, clearEditingQuiz, setQuizzes, updateQuiz } from "./reducer";
// eslint-disable-next-line
import { FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { MdDoNotDisturbAlt, MdCheckBox } from "react-icons/md"; 
import { useState, useEffect } from "react";
import { getQuizzes, deleteQuiz as deleteQuizAPI, publishQuiz } from "./client";

interface StudentAttempt {
  student: string;
  attempts: {
    attemptNumber: number;
    answers: {
      questionId: string;
      answer: string;
    }[];
    score: number;
    timestamp: Date;
  }[];
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: string;
  points: number;
  total_questions: number;

  type: string;
  questionList: Question[];
  assignment_group: string;
  shuffle_answer: boolean;
  is_time_limit: boolean;
  time_limit: number;
  multiple_attempts: boolean;
  how_many_attempts: number;
  show_correct_answers: string;
  access_code: string;
  one_question_at_a_time: boolean;
  webcam_required: boolean;
  lock_after_answering: boolean;
  lockdown_browser: boolean;
  required_to_view_result: boolean;
  view_responses: string;

  dueDate: string;
  availableFrom: string;
  untilDate: string;
  isPublished: boolean;
  studentAttempts: StudentAttempt[]; // Ensure studentAttempts field is present
}

interface Question {
  _id: string;
  type: string;
  title: string;
  points: number;
  question: string;
  answers: string[];
  correct_answer: string;
  true_or_false: boolean;
  blanks: string[];
  previewAnswer: string;
  students: string[];
  studentAnswer: string[];
}

// eslint-disable-next-line
function calculatePoints(quiz: Quiz, username: string) {
  let points = 0;
  quiz.questionList.forEach((q) => {
    if (q.students.includes(username)) {
      if (q.type === "Multiple Choice") {
        if (q.studentAnswer[q.students.indexOf(username)] === q.correct_answer) {
          points = points + q.points;
        }
      } else if (q.type === "True/False") {
        if (q.true_or_false && q.studentAnswer[q.students.indexOf(username)] === "true") {
          points = points + q.points;
        }
        if (!q.true_or_false && q.studentAnswer[q.students.indexOf(username)] === "false") {
          points = points + q.points;
        }
      } else if (q.type === "Fill In the Blank") {
        if (q.blanks.includes(q.studentAnswer[q.students.indexOf(username)])) {
          points = points + q.points;
        }
      }
    }
  });
  return points;
}

function calculateLatestAttemptScore(quiz: Quiz, studentId: string) {
  const studentRecord = quiz.studentAttempts.find(attempt => attempt.student === studentId);
  if (studentRecord) {
      const latestAttempt = studentRecord.attempts[studentRecord.attempts.length - 1];
      return latestAttempt ? latestAttempt.score : 0;
  }
  return 0;
}

function calculateQuizPoints(quiz: Quiz) {
  let points = 0;
  quiz.questionList.forEach((q) => {
    points = points + q.points;
  });
  return points;
}

function checkStatus(quiz: Quiz) {
  console.log(quiz);

  const currentDate1 = new Date();
  const availableDate1 = new Date(quiz.availableFrom);
  // eslint-disable-next-line
  const dueDate1 = new Date(quiz.dueDate);
  const untilDate1 = new Date(quiz.untilDate);

  let mark = "Not available until " + quiz.availableFrom;
  if (untilDate1 < currentDate1) {
    mark = "Closed";
  } else if (availableDate1 < currentDate1) {
    mark = "Available";
  }
  return mark;
}

export default function Quizzes() {
  const { cid } = useParams<{ cid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [quizDetails, showQuizDetail] = useState<Quiz | null>(null);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const role = currentUser.role; 
      let data = await getQuizzes(cid!, role); 

      
      data = data.map((quiz: Quiz) => ({
        ...quiz,
        studentAttempts: quiz.studentAttempts || [],
      }));

      dispatch(setQuizzes(data));
    };
    fetchQuizzes();
  }, [cid, dispatch, currentUser.role]); 

  const handleDelete = async () => {
    if (quizToDelete) {
      await deleteQuizAPI(quizToDelete._id);
      dispatch(deleteQuiz(quizToDelete._id));
      setQuizToDelete(null);
    }
  };

  const handlePublish = async (quiz: Quiz) => {
    const updatedQuiz = await publishQuiz(quiz._id, !quiz.isPublished); 
    dispatch(updateQuiz(updatedQuiz));
    const role = currentUser.role;
    const data = await getQuizzes(cid!, role); 
    dispatch(setQuizzes(data)); 
  };

  return (
    <div id="wd-quizzes" className="container mt-4">
      <div
        id="wd-quizzes-controls"
        className="d-flex justify-content-between align-items-center mb-3"
      >
        <div className="position-relative">
          <input
            id="wd-search-quizzes"
            className="form-control"
            placeholder="Search for Quiz"
          />
        </div>

        <div
          id="wd-controls-right"
          className="d-flex justify-content-between align-items-center"
        >
          {(currentUser.role === "FACULTY" || currentUser.role === "ADMIN") && (
            <div>
              <button
                id="wd-add-quiz"
                className="btn btn-danger"
                onClick={() => {
                  dispatch(clearEditingQuiz());
                  navigate(`/Kanbas/Courses/${cid}/Quizzes/Editor`);
                }}
              >
                + Quiz
              </button>
            </div>
          )}
          <div className="three-dots-button" id="threeDotsButton-main">
            <IoEllipsisVertical className="fs-4" />
          </div>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center wd-quiz-title-item">
        <h3 id="wd-quizzes-title" className="mb-0">
          Assignment Quizzes
        </h3>
      </div>

      <ul id="wd-quiz-list" className="list-unstyled">
        {quizzes
          .filter((quiz: Quiz) => quiz.course === cid)
          .map((quiz: Quiz) => (
            <li
              key={quiz._id}
              className="wd-quiz-list-item ps-3 d-flex justify-content-between align-items-center"
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="quiz-details">
                  <div className="first-line">
                    <Link
                      to={
                        (currentUser.role === "FACULTY" || currentUser.role === "ADMIN")
                          ? `/Kanbas/Courses/${cid}/Quizzes/Editor/${quiz._id}`
                          : `/Kanbas/Courses/${cid}/Quizzes/TakeQuiz/${quiz._id}`
                      }
                      className="wd-quiz-link text-decoration-none"
                      onClick={() =>
                        dispatch(
                          setEditingQuiz({
                            ...quiz,
                            studentAttempts: quiz.studentAttempts || [],
                          })
                        )
                      }
                    >
                      {quiz.title}
                    </Link>
                  </div>
                  <div className="second-line text-muted">
                    <span>
                      <b>{checkStatus(quiz)}</b>
                    </span>{" "}
                    |{" "}
                    <span>
                      <b>Due</b> {quiz.dueDate}
                    </span>{" "}
                    |{" "}
                    <span>
                      {calculateLatestAttemptScore(quiz, currentUser._id)}/
                      {calculateQuizPoints(quiz)} pts
                    </span>{" "}
                    | <span>{quiz.questionList.length} Questions</span>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div className="three-dots-button-item" id="threeDotsButton">
                  <div className="item-actions">
                    {quiz.isPublished ? (
                      <MdCheckBox style={{ color: "green" }} /> 
                    ) : (
                      <MdDoNotDisturbAlt style={{ color: "red" }} /> 
                    )}
                  </div>
                </div>
                {(currentUser.role === "FACULTY" || currentUser.role === "ADMIN") && (
                  <>
                    <div
                      className="three-dots-button-item"
                      id="threeDotsButton"
                      data-bs-toggle="dropdown"
                    >
                      <IoEllipsisVertical className="symbol-quiz fs-5" />
                    </div>
                    <ul
                      id="dropdown"
                      className="dropdown-menu align-items-center"
                      style={{ textAlign: "center", maxWidth: "120%" }}
                    >
                      <li
                        className="dropdown-option"
                        style={{ cursor: "pointer" }}
                        onClick={() => showQuizDetail(quiz)}
                      >
                        <b>Edit</b>
                      </li>

                      <li
                        className="dropdown-option"
                        style={{ cursor: "pointer" }}
                        onClick={() => setQuizToDelete(quiz)}
                      >
                        <b>Delete</b>
                      </li>

                      {currentUser.role === "FACULTY" && (
                        <li
                          className="dropdown-option"
                          style={{ cursor: "pointer" }}
                          onClick={() => handlePublish(quiz)}
                        >
                          {quiz.isPublished ? <b>Unpublish</b> : <b>Publish</b>}
                        </li>
                      )}
                      <li>Copy</li>
                      <li>Sort</li>
                    </ul>
                  </>
                )}
              </div>
            </li>
          ))}
      </ul>

      {quizToDelete && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header justify-content-between">
                <h5 className="modal-title">Delete Quiz</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setQuizToDelete(null)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this quiz?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setQuizToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quizDetails && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="d-flex modal-header justify-content-between">
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={() => {
                      dispatch(
                        setEditingQuiz({
                          ...quizDetails,
                          studentAttempts: quizDetails.studentAttempts || [],
                        })
                      );
                      navigate(
                        `/Kanbas/Courses/${cid}/Quizzes/Preview/${quizDetails._id}`
                      );
                    }}
                  >
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => {
                      dispatch(
                        setEditingQuiz({
                          ...quizDetails,
                          studentAttempts: quizDetails.studentAttempts || [],
                        })
                      );
                      navigate(
                        `/Kanbas/Courses/${cid}/Quizzes/Editor/${quizDetails._id}`
                      );
                    }}
                  >
                    <span>Edit</span>
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-danger detail-close-btn"
                  onClick={() => showQuizDetail(null)}
                >
                  <span>Close</span>
                </button>
              </div>

              <div className="modal-body d-flex justify-content-between align-items-center">
                <h4>
                  <b>{quizDetails.title}</b>
                </h4>
              </div>

              <div className="modal-body d-flex">
                <div className="modal-body-left">
                  <span>Quiz Type</span> <br />
                  <span>Points</span> <br />
                  <span>Assignment Group</span> <br />
                  <span>Shuffle Answers</span> <br />
                  <span>Time Limit</span> <br />
                  <span>Multiple Attempts</span> <br />
                  <span>View Responses</span> <br />
                  <span>Show Correct Answers</span> <br />
                  <span>One Question at a Time</span> <br />
                  <span>Require Respondus LockDown Browser</span> <br />
                  <span>Required to View Quiz Results</span> <br />
                  <span>Webcam Required</span> <br />
                  <span>Lock Questions After Answering</span>
                </div>

                <div className="modal-body-right">
                  <span>{quizDetails.type}</span> <br />
                  <span>{quizDetails.points}</span> <br />
                  <span>{quizDetails.assignment_group}</span> <br />
                  {quizDetails.shuffle_answer && <> <span>True</span> <br /></>}
                  {!quizDetails.shuffle_answer && <> <span>False</span> <br /></>}
                  {quizDetails.is_time_limit && <> <span>{quizDetails.time_limit}</span> <br /></>}
                  {!quizDetails.is_time_limit && <> <span>No Time Limit</span> <br /></>}
                  {quizDetails.multiple_attempts && <> <span>{quizDetails.how_many_attempts}</span> <br /></>}
                  {!quizDetails.multiple_attempts && <> <span>Only One Attempt</span> <br /></>}
                  <span>{quizDetails.view_responses}</span> <br />
                  <span>{quizDetails.show_correct_answers}</span> <br />
                  {quizDetails.one_question_at_a_time && <> <span>True</span> <br /></>}
                  {!quizDetails.one_question_at_a_time && <> <span>False</span> <br /></>}
                  {quizDetails.lockdown_browser && <> <span>True</span> <br /></>}
                  {!quizDetails.lockdown_browser && <> <span>False</span> <br /></>}
                  {quizDetails.required_to_view_result && <> <span>True</span> <br /></>}
                  {!quizDetails.required_to_view_result && <> <span>False</span> <br /></>}
                  {quizDetails.webcam_required && <> <span>True</span> <br /></>}
                  {!quizDetails.webcam_required && <> <span>False</span> <br /></>}
                  {quizDetails.lock_after_answering && <> <span>True</span> <br /></>}
                  {!quizDetails.lock_after_answering && <> <span>False</span> <br /></>}
                </div>
              </div>

              <div className="modal-body container-modal">
                <div className="item">
                  <b>Due</b>
                </div>
                <div className="item">
                  <b>For</b>
                </div>
                <div className="item">
                  <b>Available from</b>
                </div>
                <div className="item">
                  <b>Until</b>
                </div>
              </div>
              <hr className="mid-line" />
              <div className="modal-body container-modal">
                <div className="item">{quizDetails.dueDate}</div>
                <div className="item">Everyone</div>
                <div className="item">{quizDetails.availableFrom}</div>
                <div className="item">{quizDetails.untilDate}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
