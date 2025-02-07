import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

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
}

export const getQuizzes = async (courseId: string, role: string) => {
  try {
      const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`, {
          params: { role } 
      });
      return response.data;
  } catch (error) {
      console.error("Failed to fetch quizzes:", error); 
      throw error;
  }
};



export const getQuizById = async (quizId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const createQuiz = async (
  courseId: string,
  quiz: Omit<Quiz, "_id">
) => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/quizzes`,
    quiz
  );
  return response.data;
};

export const updateQuiz = async (quiz: Quiz) => {
  const response = await axios.put(
    `${QUIZZES_API}/${quiz._id}`,
    quiz
  );
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const publishQuiz = async (quizId: string, isPublished: boolean) => {
  const response = await axios.put(`${QUIZZES_API}/${quizId}/publish`, { isPublished });
  return response.data;
};

export const submitQuiz = async (quizId: string, data: { studentId: string, answers: { questionId: string, answer: string }[] }) => {
  const response = await axios.post(`${QUIZZES_API}/${quizId}/submit`, data);
  return response.data;
};


