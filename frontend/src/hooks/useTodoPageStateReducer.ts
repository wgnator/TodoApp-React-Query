import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

type TodoPageState = {
  showingContentTodoID: string | null;
  composingTodoID: string | null;
};
type TodoPageStateReducerAction = {
  type: keyof typeof ACTIONS;
  todoIDPayload?: null | string;
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
      if (action.todoIDPayload !== undefined)
        return { ...state, showingContentTodoID: action.todoIDPayload };
    case ACTIONS.SET_COMPOSING_TODO_ID:
      if (action.todoIDPayload !== undefined)
        return { ...state, composingTodoID: action.todoIDPayload };
    default:
      throw new Error(
        `todoPageStateReducer action type/payload error. Received action: ${JSON.stringify(action)}`
      );
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
      dispatch({ type: ACTIONS.SET_SHOWING_CONTENT_TODO_ID, todoIDPayload: showingTodoIDParam });
    else dispatch({ type: ACTIONS.SET_SHOWING_CONTENT_TODO_ID, todoIDPayload: null });
  }, [showingTodoIDParam]);

  return { pageState, dispatch, showingTodoIDParam };
}
