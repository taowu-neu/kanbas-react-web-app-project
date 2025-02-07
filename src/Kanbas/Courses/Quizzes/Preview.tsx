import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearEditingQuiz, setEditingQuiz } from "./reducer";
import { useState, useEffect } from "react";
import { getQuizzes, updateQuiz } from "./client"; 
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

export default function QuizPreview() {
  const { qid, cid } = useParams<{ qid?: string; cid?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { editingQuiz } = useSelector((state: any) => state.quizzesReducer);
  const [currentSaveTime, setCurrentSaveTime] = useState(new Date());
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSaveTime(new Date());
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

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
            studentAttempts: currentQuiz.studentAttempts || [] 
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

  const handleSave = async () => {
    await updateQuiz({
      ...quiz,
      studentAttempts: (quiz as Quiz).studentAttempts || [], 
      isPublished: quiz.isPublished ?? false
    }); 
    dispatch(clearEditingQuiz());
    navigate(`/Kanbas/Courses/${cid}/Quizzes`);
  };

  const currentTime = new Date();

  const handleAnswerChanged = (quiz: Quiz, q: Question, answer: string) => {
    const updateQuestion = { ...q };
    updateQuestion.previewAnswer = answer;
    const updatedQuiz = {
      ...quiz,
      questionList: quiz.questionList.map((question) =>
        question._id === q._id ? updateQuestion : question
      ),
    };
    setQuiz(updatedQuiz);
    updateQuiz(updatedQuiz); 
  };

  return (
    <div id="wd-quizzes-editor" className="container mt-4">
      <h2>
        <b>{quiz.title}</b>
      </h2>
      <button
        disabled
        className="danger-box"
        style={{
          backgroundColor: "#FAF0E6",
          color: "#FA8072",
          border: "none",
          borderRadius: "5px",
          height: "40px",
          width: "100%",
        }}
      >
        <span>This is a preview of the published version of the quiz.</span>
      </button>
      <br />
      <span>Started: {currentTime.toLocaleString()} </span>
      <h3>
        <b>Quiz Instructions</b>
      </h3>
      <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
      <hr />
      <div>
        <div className="questions-editor">
          <div
            className="questions-list"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <ul style={{ listStyleType: "none", width: '100%'  }}>
              {quiz.questionList.map((question, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "15px",
                    border: "2px solid #ccc",
                    padding: "10px",
                  }}
                >
                  <QuestionDisplay
                    quiz={quiz}
                    q={question}
                    onAnswerChanged={handleAnswerChanged}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="d-flex justify-content-end align-items-center"
        style={{ border: "1px solid black", padding: "10px" }}
      >
        <span> Quiz saved at {currentSaveTime.toLocaleTimeString()} </span>
        <button
          style={{
            marginLeft: "10px",
            border: "none",
            borderRadius: "5px",
            height: "40px",
            width: "80px",
          }}
          onClick={handleSave}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

interface QuestionDisplayProps {
  quiz: Quiz;
  q: Question;
  onAnswerChanged: (quiz: Quiz, q: Question, answer: string) => void;
}

function QuestionDisplay({ quiz, q, onAnswerChanged }: QuestionDisplayProps) {
  return (
    <div>
      {q.type === "Multiple Choice" && (
        <div>
          <div
            className="question-header justify-content-between"
            style={{
              marginBottom: "3px",
              alignItems: "center",
              display: "flex",
              backgroundColor: "#DCDCDC",
            }}
          >
            <span>
              <b>{q.title} </b>
            </span>
            <span> {q.points} pts</span>
          </div>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: q.question }} />
          <ul
            style={{
              listStyleType: "none",
              marginBottom: "3px",
              alignItems: "center",
            }}
          >
            {q.answers.map((answer, idx) => (
              <li
                key={idx}
                style={{
                  marginBottom: "3px",
                  alignItems: "center",
                }}
              >
                <hr />
                <input
                  type="radio"
                  name={"Answer" + q._id}
                  checked={q.previewAnswer === answer}
                  onChange={() => onAnswerChanged(quiz, q, answer)}
                />
                <span>&nbsp;&nbsp;{answer}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {q.type === "True/False" && (
        <div>
          <div
            className="question-header d-flex justify-content-between"
            style={{
              marginBottom: "3px",
              alignItems: "center",
              backgroundColor: "#DCDCDC",
            }}
          >
            <span>
              <b> {q.title} </b>
            </span>
            <span> {q.points} pts</span>
          </div>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: q.question }} />
          <ul style={{ listStyleType: "none" }}>
            <li key="True">
              <hr />
              <input
                type="radio"
                name={"Answer" + q._id}
                checked={q.previewAnswer === "true"}
                onChange={() => onAnswerChanged(quiz, q, "true")}
              />
              <span style={{ marginLeft: "5px", width: "500px" }}>True</span>
            </li>
            <li key="false">
              <hr />
              <input
                type="radio"
                name={"Answer" + q._id}
                checked={q.previewAnswer === "false"}
                onChange={() => onAnswerChanged(quiz, q, "false")}
              />
              <span style={{ marginLeft: "5px", width: "500px" }}>False</span>
            </li>
          </ul>
        </div>
      )}

      {q.type === "Fill In the Blank" && (
        <div>
          <div
            className="question-header d-flex justify-content-between"
            style={{
              marginBottom: "3px",
              alignItems: "center",
              backgroundColor: "#DCDCDC",
            }}
          >
            <span>
              <b> {q.title} </b>
            </span>
            <span> {q.points} pts</span>
          </div>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: q.question }} />
          <hr />
          <span> Enter Your Answer: </span>
          <input
            type="text"
            value={q.previewAnswer}
            style={{ marginLeft: "5px", width: "400px" }}
            onChange={(e) => onAnswerChanged(quiz, q, e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
