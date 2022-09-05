import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

type TodoDisplayState = {
  showingContentTodoID: string | null;
  composingTodoID: string | null;
};
type TodoDisplayStateReducerAction = {
  type: keyof typeof ACTIONS;
  todoIDPayload?: null | string;
};

const initialState: TodoDisplayState = {
  showingContentTodoID: null,
  composingTodoID: null,
};

export type TodoDispatch = (value: TodoDisplayStateReducerAction) => void;

export const ACTIONS = {
  SET_SHOWING_CONTENT_TODO_ID: "SET_SHOWING_CONTENT_TODO_ID",
  SET_COMPOSING_TODO_ID: "SET_COMPOSING_TODO_ID",
} as const;

const todoDisplayStateReducer: React.Reducer<TodoDisplayState, TodoDisplayStateReducerAction> = (
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
        `todoDisplayStateReducer action type/payload error. Received action: ${JSON.stringify(
          action
        )}`
      );
  }
};

export default function useTodoDisplayStateReducer() {
  const { showingTodoIDParam } = useParams();

  const initializer = (initialState: TodoDisplayState) => ({
    ...initialState,
    showingContentTodoID: showingTodoIDParam || null,
  });

  const [todoDisplayStates, dispatch] = useReducer<
    React.Reducer<TodoDisplayState, TodoDisplayStateReducerAction>,
    TodoDisplayState
  >(todoDisplayStateReducer, initialState, initializer);

  useEffect(() => {
    if (showingTodoIDParam)
      dispatch({ type: ACTIONS.SET_SHOWING_CONTENT_TODO_ID, todoIDPayload: showingTodoIDParam });
    else dispatch({ type: ACTIONS.SET_SHOWING_CONTENT_TODO_ID, todoIDPayload: null });
  }, [showingTodoIDParam]);

  return { todoDisplayStates, dispatch, showingTodoIDParam };
}
