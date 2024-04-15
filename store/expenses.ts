import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Expenses } from "../utils/types";

// Define a type for the slice state
export type CounterState = {
  expenses: Expenses[];
};

// Define the initial state using that type
const initialState: CounterState = {
  expenses: [],
};

export const ExpensesSlice = createSlice({
  name: "expenses",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addExpense: (
      state,
      action: PayloadAction<{
        id: string;
        description: string;
        amount: number;
        date: Date;
      }>
    ) => {
      state.expenses.unshift({
        id: action.payload.id,
        description: action.payload.description,
        amount: action.payload.amount,
        date: action.payload.date,
      });
    },
    setExpenses: (state, action: PayloadAction<{ expenses: Expenses[] }>) => {
      state.expenses = action.payload.expenses;
    },
    deleteExpense: (
      state,
      action: PayloadAction<{ editedExpenseId: string  }>
    ) => {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload.editedExpenseId
      );
    },

    updateExpense: (
      state,
      action: PayloadAction<{
        id: string;
        description: string;
        amount: number;
        date: Date;
      }>
    ) => {
      const expenseIndex = state.expenses.findIndex(
        (expense) => expense.id === action.payload.id
      );
      if (expenseIndex !== -1) {
        state.expenses[expenseIndex] = {
          id: action.payload.id,
          description: action.payload.description,
          amount: action.payload.amount,
          date: action.payload.date,
        };
      }
    },
  },
});

export const { addExpense, deleteExpense, updateExpense, setExpenses } =
  ExpensesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.expenses;

export default ExpensesSlice.reducer;
