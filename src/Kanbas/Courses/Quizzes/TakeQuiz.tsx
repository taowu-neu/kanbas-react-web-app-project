import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearEditingQuiz, setEditingQuiz, setQuizzes } from "./reducer";
import { useState, useEffect } from "react";
import { getQuizzes, updateQuiz, submitQuiz } from "./client"; // 导入submitQuiz函数
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

interface AttemptAnswer {
  questionId: string;
  answer: string;
}

interface StudentAttempt {
  student: string;
  attempts: {
    attemptNumber: number;
    answers: AttemptAnswer[];
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

export default function QuizTake() {
  const { qid, cid } = useParams<{ qid?: string; cid?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { editingQuiz } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
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
  const [currentSaveTime, setCurrentSaveTime] = useState(new Date());
  const [exceededAttempts, setExceededAttempts] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<AttemptAnswer[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSaveTime(new Date());
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid) {
        const role = currentUser.role; 
        const quizzes = await getQuizzes(cid!, role); 
        const currentQuiz = quizzes.find((q: Quiz) => q._id === qid);
        if (currentQuiz) {
          dispatch(setEditingQuiz(currentQuiz));
        }
      }
    };

    fetchQuiz();
  }, [qid, cid, dispatch, currentUser.role]);

  useEffect(() => {
    if (editingQuiz) {
      setQuiz(editingQuiz);
      
      const studentRecord = editingQuiz.studentAttempts.find(
        (attempt: StudentAttempt) => attempt.student === currentUser._id
      );
      if (studentRecord) {
        const lastAttemptIndex = studentRecord.attempts.length - 1;
        if (studentRecord.attempts.length >= editingQuiz.how_many_attempts) {
          setExceededAttempts(true);
        }
        setLastAttempt(studentRecord.attempts[lastAttemptIndex]?.answers || []);
      }
    }
  }, [editingQuiz, currentUser._id]);

  const handleAnswerChanged = (quiz: Quiz, q: Question, answer: string) => {
    const updatedQuestion = { ...q };

    
    updatedQuestion.previewAnswer = answer;

    if (updatedQuestion.students.includes(currentUser._id)) {
      const index = updatedQuestion.students.indexOf(currentUser._id);
      updatedQuestion.studentAnswer = updatedQuestion.studentAnswer.map((a, i) =>
        i === index ? answer : a
      );
    } else {
      updatedQuestion.students = [...updatedQuestion.students, currentUser._id];
      updatedQuestion.studentAnswer = [...updatedQuestion.studentAnswer, answer];
    }

    const updatedQuiz = {
      ...quiz,
      questionList: quiz.questionList.map((question) =>
        question._id === q._id ? updatedQuestion : question
      ),
    };

    setQuiz(updatedQuiz);
    updateQuiz(updatedQuiz); 
  };

  const handleSave = async () => {
    if (exceededAttempts) {
      alert("You have reached the maximum number of attempts.");
      return;
    }

    const answers = quiz.questionList.map((q) => ({
      questionId: q._id,
      answer: q.previewAnswer || "",
    }));

    console.log("Submitting answers:", answers);

    const result = await submitQuiz(qid!, { studentId: currentUser._id, answers });

    if (result.score !== undefined) {
      //alert(`Your score: ${result.score}`);

      
      const role = currentUser.role;
      const quizzes = await getQuizzes(cid!, role);
      dispatch(setQuizzes(quizzes));
    }

    dispatch(clearEditingQuiz());
    navigate(`/Kanbas/Courses/${cid}/Quizzes`);
  };

  const getAnswerStatus = (questionId: string) => {
    const attemptAnswer = lastAttempt.find(a => a.questionId === questionId)?.answer;
    const question = quiz.questionList.find(q => q._id === questionId);

    if (attemptAnswer === question?.correct_answer) {
      return 'correct';
    } else {
      return 'incorrect';
    }
  };

  const currentTime = new Date();

  return (
    <div id="wd-quizzes-editor" className="container mt-4">
      <h2>
        <b>{quiz.title}</b>
      </h2>
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
            <ul style={{ listStyleType: "none", width: '100%' }}>
              {quiz.questionList.map((question, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "15px",
                    border: "2px solid #ccc",
                    padding: "10px",
                    backgroundColor: exceededAttempts ? 
                      (getAnswerStatus(question._id) === 'correct' ? '#d4edda' : '#f8d7da') : 'white'
                  }}
                >
                  <QuestionDisplay
                    quiz={quiz}
                    q={question}
                    userName={currentUser._id}
                    onAnswerChanged={handleAnswerChanged}
                    disabled={exceededAttempts} 
                  />
                  {exceededAttempts && (
                    <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
                      Correct Answer: {question.correct_answer}
                    </div>
                  )}
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
          disabled={exceededAttempts} 
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
  userName: string;
  onAnswerChanged: (quiz: Quiz, q: Question, answer: string) => void;
  disabled: boolean;
}

function QuestionDisplay({ quiz, q, userName, onAnswerChanged, disabled }: QuestionDisplayProps) {
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
                  checked={
                    q.previewAnswer === answer 
                  }
                  onChange={() => onAnswerChanged(quiz, q, answer)}
                  disabled={disabled} 
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
                disabled={disabled} 
              />
              <span style={{ marginLeft: "5px", width: "500px" }}>True</span>
            </li>
            <li key="False">
              <hr />
              <input
                type="radio"
                name={"Answer" + q._id}
                checked={q.previewAnswer === "false"} 
                onChange={() => onAnswerChanged(quiz, q, "false")}
                disabled={disabled} 
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
            value={q.previewAnswer || ""}
            style={{ marginLeft: "5px", width: "400px" }}
            onChange={(e) => onAnswerChanged(quiz, q, e.target.value)}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}

