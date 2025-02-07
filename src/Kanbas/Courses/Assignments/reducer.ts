import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: string;
}
interface AssignmentsState {
  assignments: Assignment[];
  editingAssignment: Assignment | null;
}

const initialState: AssignmentsState = {
  assignments: [],
  editingAssignment: null,
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
    },
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      const newAssignment = {
        ...action.payload,
        _id: action.payload._id || new Date().getTime().toString(),
      };
      state.assignments.push(newAssignment);
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.assignments = state.assignments.filter(
        (a) => a._id !== action.payload
      );
    },
    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments = state.assignments.map((a) =>
        a._id === action.payload._id ? action.payload : a
      );
    },
    setEditingAssignment: (state, action: PayloadAction<Assignment | null>) => {
      state.editingAssignment = action.payload;
    },
    clearEditingAssignment: (state) => {
      state.editingAssignment = null;
    },
  },
});

export const {
  setAssignments,
  addAssignment,
  deleteAssignment,
  updateAssignment,
  setEditingAssignment,
  clearEditingAssignment,
} = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
