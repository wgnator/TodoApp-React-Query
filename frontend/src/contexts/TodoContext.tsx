import { createContext, ReactNode, useContext, useEffect } from "react";
import useTodoQuery from "../hooks/fetch/useTodoQuery";

const TodoContext = createContext({} as ReturnType<typeof useTodoQuery>);

export function TodoContextProvider({ children }: { children: ReactNode }) {
  const {
    todos,
    createTodoMutation,
    updateTodoMutation,
    deleteTodoMutation,
    isLoading,
    isError,
    error,
  } = useTodoQuery();

  return (
    <TodoContext.Provider
      value={{
        todos,
        createTodoMutation,
        updateTodoMutation,
        deleteTodoMutation,
        isLoading,
        isError,
        error,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export const useTodoContext = () => useContext(TodoContext);
