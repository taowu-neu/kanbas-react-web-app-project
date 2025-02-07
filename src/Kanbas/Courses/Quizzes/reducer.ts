import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface QuizzesState {
  quizzes: Quiz[];
  editingQuiz: Quiz | null;
}

const initialState: QuizzesState = {
  quizzes: [],
  editingQuiz: null,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload;
    },
    addQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes.push(action.payload);
    },
    deleteQuiz: (state, action: PayloadAction<string>) => {
      state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
    },
    updateQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes = state.quizzes.map((q) =>
        q._id === action.payload._id ? action.payload : q
      );
    },
    setEditingQuiz: (state, action: PayloadAction<Quiz | null>) => {
      state.editingQuiz = action.payload;
    },
    clearEditingQuiz: (state) => {
      state.editingQuiz = null;
    },
  },
});

export const {
  setQuizzes,
  addQuiz,
  deleteQuiz,
  updateQuiz,
  setEditingQuiz,
  clearEditingQuiz,
} = quizzesSlice.actions;
export default quizzesSlice.reducer;
