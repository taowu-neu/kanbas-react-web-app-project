import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoEllipsisVertical } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { clearEditingQuiz, setEditingQuiz } from "./reducer";
import { createQuiz, updateQuiz, getQuizzes } from "./client";
import "./editor.css";

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
  studentAttempts: StudentAttempt[];
}

export default function QuizEditor() {
  const { qid, cid } = useParams<{ qid?: string; cid?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const { editingQuiz } = useSelector(
    (state: any) => state.quizzesReducer
  );

  const [quiz, setQuiz] = useState<Quiz>({
    _id: qid || "",
    title: "",
    description: "",
    points: 0,
    dueDate: "",
    availableFrom: "",
    untilDate: "",
    course: cid || "",
    total_questions: 0,
    type: "Graded Quiz",
    questionList: [],
    assignment_group: "Quizzes",
    shuffle_answer: true,
    is_time_limit: false,
    time_limit: 20,
    multiple_attempts: false,
    how_many_attempts: 1,
    show_correct_answers: "Immediately",
    access_code: "",
    one_question_at_a_time: true,
    webcam_required: false,
    lock_after_answering: false,
    lockdown_browser: false,
    required_to_view_result: false,
    view_responses: "Always",
    isPublished: false,
    studentAttempts: [],
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid) {
        const role = currentUser.role;
        const quizzes = await getQuizzes(cid!, role);
        const currentQuiz = quizzes.find((q: Quiz) => q._id === qid);
        if (currentQuiz) {
          dispatch(setEditingQuiz({
            ...currentQuiz,
            studentAttempts: currentQuiz.studentAttempts || [],
          }));
        }
      }
    };

    fetchQuiz();
  }, [qid, cid, dispatch, currentUser.role]);

  useEffect(() => {
    if (editingQuiz) {
      setQuiz({
        ...editingQuiz,
        studentAttempts: editingQuiz.studentAttempts || []
      });
    }
  }, [editingQuiz]);

  const [newQuestion, setNewQuestion] = useState<Question>({
    _id: new Date().getTime().toString(),
    type: "Multiple Choice",
    title: "",
    points: 0,
    question: "",
    answers: [],
    correct_answer: "",
    true_or_false: true,
    blanks: [],
    previewAnswer: "",
    students: [],
    studentAnswer: []
  });

  const handleAddQuestion = () => {
    const updatedQuiz = {
      ...quiz,
      questionList: [...quiz.questionList, newQuestion],
      points: quiz.points + newQuestion.points,
    };

    setQuiz(updatedQuiz);

    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      _id: new Date().getTime().toString(),
    }));
  };

  const [activeButton, setActiveButton] = useState<number | null>(0);

  const handleButtonClick = (index: number) => {
    setActiveButton(index);
  };

  // eslint-disable-next-line
  const handleDocumentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      !target.classList.contains('btn') &&
      activeButton !== null
    ) {
      setActiveButton(null);
    }
  };

  // eslint-disable-next-line
  const [quizType, setQuizType] = useState('Graded Quiz');
  const quizTypeOption = [
    { value: 'Graded Quiz', label: 'Graded Quiz' },
    { value: 'Practice Quiz', label: 'Practice Quiz' },
    { value: 'Graded Survey', label: 'Graded Survey' },
    { value: 'Ungraded Survey', label: 'Ungraded Survey' },
  ];
  const handleQuizTypeChange = (type: string) => {
    setQuizType(type);
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      type: type,
    }));
  };

  // eslint-disable-next-line
  const [assignmentGroup, setAssignmentGroup] = useState('Quizzes');
  const assignmentGroupOption = [
    { value: 'Quizzes', label: 'Quizzes' },
    { value: 'Exams', label: 'Exams' },
    { value: 'Assignments', label: 'Assignments' },
    { value: 'Project', label: 'Project' },
  ];
  const handleAssignmentGroupChange = (type: string) => {
    setAssignmentGroup(type);
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      assignment_group: type,
    }));
  };

  // eslint-disable-next-line
  const [showCorrectAnswer, setShowCorrectAnswer] = useState('Immediately');
  const showCorrectAnswerOption = [
    { value: 'Immediately', label: 'Immediately' },
    { value: 'Later', label: 'Later' },
  ];
  const handleShowCorrectAnswerChange = (type: string) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      show_correct_answers: type,
    }));
  };

  const handleShuffleAnswerChange = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      shuffle_answer: !prevQuiz.shuffle_answer,
    }));
  };

  const handleTimeLimitChange = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      is_time_limit: !prevQuiz.is_time_limit,
    }));
  };

  const handleMultipleAttemptChange = (checked: boolean) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      multiple_attempts: checked,
    }));
  };

  const handleOneQuestionChange = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      one_question_at_a_time: !prevQuiz.one_question_at_a_time,
    }));
  };

  const handleWebcamRequiredChange = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      webcam_required: !prevQuiz.webcam_required,
    }));
  };

  const handleLockQuestionChange = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      lock_after_answering: !prevQuiz.lock_after_answering,
    }));
  };

  const handleChangeInstrctions = (newDescription: string) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      description: newDescription,
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const totalPoints = quiz.questionList.reduce((total, question) => total + question.points, 0);
    const quizToSave = {
      ...quiz,
      points: totalPoints, 
    };

    if (qid) {
      await updateQuiz(quizToSave);
      dispatch(clearEditingQuiz());
      navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    } else {
      // eslint-disable-next-line
      const newQuiz = await createQuiz(cid!, { ...quizToSave, isPublished: false });
      dispatch(clearEditingQuiz());
      navigate(`/Kanbas/Courses/${cid}/Quizzes`, { replace: true });
    }
  };

  const handleCancel = () => {
    dispatch(clearEditingQuiz());
    navigate(`/Kanbas/Courses/${cid}/Quizzes`);
  };

  return (
    <div id="wd-quizzes-editor" className="container mt-4">
      <div className="header-row align-items-center">
        <div>
          <span> Points {quiz.points}&nbsp;</span>
        </div>

        <div className="ml-10">
          <MdDoNotDisturbAlt className="do-not-disturb-icon" />
          <span> Not Published &nbsp;</span>
        </div>
        <div className="three-dots-button" id="threeDotsButton-main">
          <IoEllipsisVertical className="fs-4" />
        </div>
      </div>

      <hr />

      <div>
        <div>
          <button
            className={`btn show-content ${activeButton === 0 ? 'active' : ''}`}
            onClick={() => handleButtonClick(0)}
          >
            Details
          </button>
          <button
            className={`btn show-content ${activeButton === 1 ? 'active' : ''}`}
            onClick={() => handleButtonClick(1)}
          >
            Questions
          </button>
        </div>
        <hr />
        {activeButton === 0 && (
          <div className="detail-info">
            <div className="col-md-10">
              <input
                id="wd-name"
                name="title"
                value={quiz.title}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <br />
            <span>&nbsp;&nbsp;Quiz Instrctions:</span>
            <div>
              <ReactQuill
                value={quiz.description}
                onChange={handleChangeInstrctions}
              />
            </div>
            <br />

            <div className="d-flex">
              <div className="modal-body-left-detail">
                <span>Quiz Type</span> <br />
                <span>Assignment Group</span> <br />
                <span>Show Correct Answers</span> <br />
              </div>

              <div className="modal-body-right-detail">
                <div className="col-md-20">
                  <select
                    value={quiz.type}
                    onChange={(e) => handleQuizTypeChange(e.target.value)}
                  >
                    {quizTypeOption.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-20">
                  <select
                    value={quiz.assignment_group}
                    onChange={(e) => handleAssignmentGroupChange(e.target.value)}
                  >
                    {assignmentGroupOption.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-20">
                  <select
                    value={quiz.show_correct_answers}
                    onChange={(e) => handleShowCorrectAnswerChange(e.target.value)}
                  >
                    {showCorrectAnswerOption.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="details-options">
                  <b>Options</b>
                </div>

                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={quiz.shuffle_answer}
                    onChange={handleShuffleAnswerChange}
                  />
                  &nbsp;&nbsp;Shuffle Answers
                </div>

                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={quiz.is_time_limit}
                    onChange={handleTimeLimitChange}
                  />
                  &nbsp;&nbsp;Time Limit
                </div>

                {quiz.is_time_limit && (
                  <div className="d-flex">
                    <input
                      type="number"
                      id="wd-time-limit"
                      name="time-limit"
                      value={quiz.time_limit}
                      onChange={(e) =>
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          time_limit: parseInt(e.target.value, 10),
                        }))
                      }
                      className="form-control"
                      style={{ width: '80px' }}
                    />
                    &nbsp;&nbsp;&nbsp;Minutes
                  </div>
                )}

                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={quiz.multiple_attempts}
                    onChange={(e) => handleMultipleAttemptChange(e.target.checked)}
                  />
                  &nbsp;&nbsp;Allow Multiple Attempts
                </div>

                {quiz.multiple_attempts && (
                  <div className="d-flex">
                    <input
                      type="number"
                      id="wd-how-many-attempts"
                      name="how-many-attempts"
                      value={quiz.how_many_attempts}
                      onChange={(e) =>
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          how_many_attempts: parseInt(e.target.value, 10),
                        }))
                      }
                      className="form-control"
                      style={{ width: '80px' }}
                    />
                    &nbsp;&nbsp;&nbsp;Times
                  </div>
                )}

                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={quiz.one_question_at_a_time}
                    onChange={handleOneQuestionChange}
                  />
                  &nbsp;&nbsp;One Question at a Time
                </div>

                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={quiz.webcam_required}
                    onChange={handleWebcamRequiredChange}
                  />
                  &nbsp;&nbsp;Webcam Required
                </div>

                <div className="d-flex align-items-center mb-4">
                  <input
                    type="checkbox"
                    checked={quiz.lock_after_answering}
                    onChange={handleLockQuestionChange}
                  />
                  &nbsp;&nbsp;Lock Questions After Answering
                </div>

                <hr />

                <div className="row mb-1">
                  <div className="col-md-12">
                    <span> Due: </span>
                    <input
                      type="date"
                      id="wd-due-date"
                      name="dueDate"
                      value={quiz.dueDate}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-1">
                  <div className="col-md-12">
                    <span> Available From: </span>
                    <input
                      type="date"
                      id="wd-available-from"
                      name="availableFrom"
                      value={quiz.availableFrom}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <span> Available Until: </span>
                    <input
                      type="date"
                      id="wd-available-until"
                      name="untilDate"
                      value={quiz.untilDate}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <hr />

                <div className="row">
                  <div className="col text-end">
                    <button onClick={handleCancel} className="btn btn-secondary me-2">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="btn btn-danger">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeButton === 1 && (
          <div className="questions-editor">
            <div className="questions-list" style={{ display: 'flex', justifyContent: 'center' }}>
              <ul style={{ listStyleType: 'none' }}>
                {quiz.questionList.map((question, index) => (
                  <li key={question._id} style={{ marginBottom: '15px', border: '2px solid #ccc', padding: '10px' }}>
                    <QuestionDisplay
                      quiz={quiz}
                      q={question}
                      onTitleChanged={(quiz, q, title) => {
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.map((item) =>
                            item._id === q._id ? { ...item, title } : item
                          ),
                        }));
                      }}
                      onTypeChanged={(quiz, q, type) => {
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.map((item) =>
                            item._id === q._id ? { ...item, type } : item
                          ),
                        }));
                      }}
                      onPointChanged={(quiz, q, points) => {
                        const oldPoints = quiz.questionList.find(item => item._id === q._id)?.points || 0;
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.map((item) =>
                            item._id === q._id ? { ...item, points } : item
                          ),
                          points: prevQuiz.points - oldPoints + points, 
                        }));
                      }}
                      onQuestionQChanged={(quiz, q, questionString) => {
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.map((item) =>
                            item._id === q._id ? { ...item, question: questionString } : item
                          ),
                        }));
                      }}
                      onQuestionAnswerAdded={(quiz, q) => {
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.map((item) =>
                            item._id === q._id
                              ? { ...item, answers: [...item.answers, "New Answer"] }
                              : item
                          ),
                        }));
                      }}
                      onQuestionAnswerDeleted={(quiz, q, idx) => {
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.map((item) =>
                            item._id === q._id
                              ? { ...item, answers: item.answers.filter((_, i) => i !== idx) }
                              : item
                          ),
                        }));
                      }}
                      OnQuestionAnswerChanged={(quiz, q, idx, newAnswer) => {
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.map((item) =>
                            item._id === q._id
                              ? {
                                  ...item,
                                  answers: item.answers.map((answer, i) =>
                                    i === idx ? newAnswer : answer
                                  ),
                                }
                              : item
                          ),
                        }));
                      }}
                      onQuestionCorrectAnswerChanged={(quiz, q, correctAnswer) => {
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.map((item) =>
                            item._id === q._id ? { ...item, correct_answer: correctAnswer } : item
                          ),
                        }));
                      }}
                      onQuestionDeleted={(quiz, q) => {
                        const deletedPoints = q.points;
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.filter(
                            (item) => item._id !== q._id
                          ),
                          points: prevQuiz.points - deletedPoints, 
                        }));
                      }}
                      onQuestionTFChanged={(quiz, q, tf) => {
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.map((item) =>
                            item._id === q._id
                              ? { ...item, true_or_false: tf, correct_answer: tf ? "true" : "false" }
                              : item
                          ),
                        }));
                      }}
                      onQuestionBlankDeleted={(quiz, q, idx) => {
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.map((item) =>
                            item._id === q._id
                              ? {
                                  ...item,
                                  blanks: item.blanks.filter((_, i) => i !== idx),
                                }
                              : item
                          ),
                        }));
                      }}
                      onQuestionBlankChanged={(quiz, q, idx, newAnswer) => {
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.map((item) =>
                            item._id === q._id
                              ? {
                                  ...item,
                                  blanks: item.blanks.map((blank, i) =>
                                    i === idx ? newAnswer : blank
                                  ),
                                  correct_answer: newAnswer, 
                                }
                              : item
                          ),
                        }));
                      }}
                      onQuestionBlankAdded={(quiz, q) => {
                        setQuiz((prevQuiz) => ({
                          ...prevQuiz,
                          questionList: prevQuiz.questionList.map((item) =>
                            item._id === q._id
                              ? { ...item, blanks: [...item.blanks, "New Blank"] }
                              : item
                          ),
                        }));
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="add-question-button" style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={handleAddQuestion}>+ New Question</button>
            </div>
            <hr />

            <div className="row">
              <div className="col text-end">
                <button onClick={handleCancel} className="btn btn-secondary me-2">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn btn-danger me-2">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface QuestionDisplayProps {
  quiz: Quiz;
  q: Question;
  onTitleChanged: (quiz: Quiz, q: Question, title: string) => void;
  onTypeChanged: (quiz: Quiz, q: Question, type: string) => void;
  onPointChanged: (quiz: Quiz, q: Question, score: number) => void;
  onQuestionQChanged: (quiz: Quiz, q: Question, questionString: string) => void;
  onQuestionAnswerAdded: (quiz: Quiz, q: Question) => void;
  onQuestionAnswerDeleted: (quiz: Quiz, q: Question, idx: number) => void;
  OnQuestionAnswerChanged: (quiz: Quiz, q: Question, idx: number, newAnswer: string) => void;
  onQuestionCorrectAnswerChanged: (quiz: Quiz, q: Question, newAnswer: string) => void;
  onQuestionDeleted: (quiz: Quiz, q: Question) => void;
  onQuestionTFChanged: (quiz: Quiz, q: Question, tf: boolean) => void;
  onQuestionBlankDeleted: (quiz: Quiz, q: Question, idx: number) => void;
  onQuestionBlankChanged: (quiz: Quiz, q: Question, idx: number, newAnswer: string) => void;
  onQuestionBlankAdded: (quiz: Quiz, q: Question) => void;
}

function QuestionDisplay({
  quiz,
  q,
  onTitleChanged,
  onTypeChanged,
  onPointChanged,
  onQuestionQChanged,
  onQuestionAnswerAdded,
  onQuestionAnswerDeleted,
  OnQuestionAnswerChanged,
  onQuestionCorrectAnswerChanged,
  onQuestionDeleted,
  onQuestionTFChanged,
  onQuestionBlankChanged,
  onQuestionBlankDeleted,
  onQuestionBlankAdded
}: QuestionDisplayProps) {

  const questionTypeOption = [
    { value: 'Multiple Choice', label: 'Multiple Choice' },
    { value: 'True/False', label: 'True/False' },
    { value: 'Fill In the Blank', label: 'Fill In the Blank' },
  ];

  return (
    <div>
      {q.type === 'Multiple Choice' && (
        <div>
          <div className="question-header" style={{ marginBottom: '3px', display: 'flex', justifyContent: 'center', alignItems: "center" }}>
            <span> Title: </span>
            <input
              type="text"
              value={q.title}
              name="title"
              style={{ width: '100px', marginLeft: '5px', marginRight: "20px" }}
              onChange={(e) => onTitleChanged(quiz, q, e.target.value)}
            />
            <span> Type: </span>
            <select
              value={q.type}
              name="type"
              style={{ height: '30px', width: '200px', marginLeft: '5px', marginRight: "20px" }}
              onChange={(e) => onTypeChanged(quiz, q, e.target.value)}
            >
              {questionTypeOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <span> Points: </span>
            <input
              type="number"
              value={q.points}
              name="points"
              style={{ width: '100px', marginLeft: '5px' }}
              onChange={(e) => onPointChanged(quiz, q, parseInt(e.target.value, 10))}
            />

            <FaTrash
              className="text-danger ms-auto"
              onClick={() => onQuestionDeleted(quiz, q)}
              style={{ cursor: "pointer", width: '40px' }}
            />
          </div>
          <hr />
          <span> Enter your question and multiple answers, then select the one correct answer.</span> <br />
          <span><b> Question:</b></span> <br />
          <ReactQuill
            value={q.question}
            onChange={(e) => onQuestionQChanged(quiz, q, e)}
          />
          <span><b> Answers:</b></span> <br />
          <ul style={{ listStyleType: 'none' }}>
            {q.answers.map((answer, idx) => (
              <li key={idx}>
                <input
                  type="radio"
                  name={"correctAnswer" + q._id}
                  checked={q.correct_answer === answer}
                  onChange={() => onQuestionCorrectAnswerChanged(quiz, q, answer)}
                />
                <input
                  type="text"
                  value={answer}
                  style={{ marginLeft: "5px", width: "500px" }}
                  onChange={(e) => OnQuestionAnswerChanged(quiz, q, idx, e.target.value)}
                />
                <FaTrash
                  className="text-danger ms-auto"
                  onClick={() => onQuestionAnswerDeleted(quiz, q, idx)}
                  style={{ cursor: "pointer", width: '40px' }}
                />
              </li>
            ))}
          </ul>
          <div className="add-question-button" style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => onQuestionAnswerAdded(quiz, q)}
              style={{ backgroundColor: '#fff', border: 'none', color: "red" }}
            >
              + Add Another Answer
            </button>
          </div>
        </div>
      )}

      {q.type === 'True/False' && (
        <div>
          <div className="question-header" style={{ marginBottom: '3px', display: 'flex', justifyContent: 'center', alignItems: "center" }}>
            <span> Title: </span>
            <input
              type="text"
              value={q.title}
              name="title"
              style={{ width: '100px', marginLeft: '5px', marginRight: "20px" }}
              onChange={(e) => onTitleChanged(quiz, q, e.target.value)}
            />
            <span> Type: </span>
            <select
              value={q.type}
              name="type"
              style={{ height: '30px', width: '200px', marginLeft: '5px', marginRight: "20px" }}
              onChange={(e) => onTypeChanged(quiz, q, e.target.value)}
            >
              {questionTypeOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <span> Points: </span>
            <input
              type="number"
              value={q.points}
              name="points"
              style={{ width: '100px', marginLeft: '5px' }}
              onChange={(e) => onPointChanged(quiz, q, parseInt(e.target.value, 10))}
            />

            <FaTrash
              className="text-danger ms-auto"
              onClick={() => onQuestionDeleted(quiz, q)}
              style={{ cursor: "pointer", width: '40px' }}
            />
          </div>
          <hr />
          <span> Enter your question text, then select if True or False is the correct answer.</span> <br />
          <span><b> Question:</b></span> <br />
          <ReactQuill
            value={q.question}
            onChange={(e) => onQuestionQChanged(quiz, q, e)}
          />
          <span><b> Answers:</b></span> <br />
          <ul style={{ listStyleType: 'none' }}>
            <li key="True">
              <input
                type="radio"
                name={"correctAnswerTF" + q._id}
                checked={q.true_or_false === true}
                onChange={() => onQuestionTFChanged(quiz, q, true)}
              />
              <span
                style={{ marginLeft: "5px", width: "500px" }}
              >True</span>
            </li>
            <li key="False">
              <input
                type="radio"
                name={"correctAnswerTF" + q._id}
                checked={q.true_or_false === false}
                onChange={() => onQuestionTFChanged(quiz, q, false)}
              />
              <span
                style={{ marginLeft: "5px", width: "500px" }}
              >False</span>
            </li>
          </ul>
        </div>
      )}

      {q.type === 'Fill In the Blank' && (
        <div>
          <div className="question-header" style={{ marginBottom: '3px', display: 'flex', justifyContent: 'center', alignItems: "center" }}>
            <span> Title: </span>
            <input
              type="text"
              value={q.title}
              name="title"
              style={{ width: '100px', marginLeft: '5px', marginRight: "20px" }}
              onChange={(e) => onTitleChanged(quiz, q, e.target.value)}
            />
            <span> Type: </span>
            <select
              value={q.type}
              name="type"
              style={{ height: '30px', width: '200px', marginLeft: '5px', marginRight: "20px" }}
              onChange={(e) => onTypeChanged(quiz, q, e.target.value)}
            >
              {questionTypeOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <span> Points: </span>
            <input
              type="number"
              value={q.points}
              name="points"
              style={{ width: '100px', marginLeft: '5px' }}
              onChange={(e) => onPointChanged(quiz, q, parseInt(e.target.value, 10))}
            />

            <FaTrash
              className="text-danger ms-auto"
              onClick={() => onQuestionDeleted(quiz, q)}
              style={{ cursor: "pointer", width: '40px' }}
            />
          </div>
          <hr />
          <span> Enter your question text, then define all possible correct answers for the blank.</span> <br />
          <span> Students will see the question followed by a small text box to type their answer.</span> <br />
          <span><b> Question:</b></span> <br />
          <ReactQuill
            value={q.question}
            onChange={(e) => onQuestionQChanged(quiz, q, e)}
          />
          <span><b> Answers:</b></span> <br />
          <ul style={{ listStyleType: 'none' }}>
            {q.blanks.map((answer, idx) => (
              <li key={idx}>
                <span> Possible Answer: </span>
                <input
                  type="text"
                  value={answer}
                  style={{ marginLeft: "5px", width: "400px" }}
                  onChange={(e) => onQuestionBlankChanged(quiz, q, idx, e.target.value)}
                />
                <FaTrash
                  className="text-danger ms-auto"
                  onClick={() => onQuestionBlankDeleted(quiz, q, idx)}
                  style={{ cursor: "pointer", width: '40px' }}
                />
              </li>
            ))}
          </ul>
          <div className="add-question-button" style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => onQuestionBlankAdded(quiz, q)}
              style={{ backgroundColor: '#fff', border: 'none', color: "red" }}
            >
              + Add Another Possible Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
