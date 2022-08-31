import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

type TodoPageState = {
  showingContentTodoID: string | null;
  composingTodoID: string | null;
};

type TodoPageStateReducerAction = {
  type: keyof typeof ACTIONS;
  payload: null | string;
};

const initialState: TodoPageState = {
  showingContentTodoID: null,
  composingTodoID: null,
};

export type TodoDispatch = (value: TodoPageStateReducerAction) => void;

export const ACTIONS = {
  SET_SHOWING_CONTENT_TODO_ID: "SET_SHOWING_CONTENT_TODO_ID",
  SET_COMPOSING_TODO_ID: "SET_COMPOSING_TODO_ID",
} as const;

const todoPageStateReducer: React.Reducer<TodoPageState, TodoPageStateReducerAction> = (
  state,
  action
) => {
  switch (action.type) {
    case ACTIONS.SET_SHOWING_CONTENT_TODO_ID:
      return { ...state, showingContentTodoID: action.payload };
    case ACTIONS.SET_COMPOSING_TODO_ID:
      return { ...state, composingTodoID: action.payload };
  }
};

export default function useTodoPageStateReducer() {
  const { showingTodoIDParam } = useParams();

  const initializer = (initialState: TodoPageState) => ({
    ...initialState,
    showingContentTodoID: showingTodoIDParam || null,
  });

  const [pageState, dispatch] = useReducer<
    React.Reducer<TodoPageState, TodoPageStateReducerAction>,
    TodoPageState
  >(todoPageStateReducer, initialState, initializer);

  useEffect(() => {
    if (showingTodoIDParam)
      dispatch({ type: ACTIONS.SET_SHOWING_CONTENT_TODO_ID, payload: showingTodoIDParam });
    else dispatch({ type: ACTIONS.SET_SHOWING_CONTENT_TODO_ID, payload: null });
  }, [showingTodoIDParam]);

  return { pageState, dispatch, showingTodoIDParam };
}
