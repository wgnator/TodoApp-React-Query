import { createContext, ReactNode, useContext } from "react";
import useTodoQuery from "../hooks/fetch/useTodoQuery";

const TodoContext = createContext({} as ReturnType<typeof useTodoQuery>);

export function TodoContextProvider({ children }: { children: ReactNode }) {
  const {
    todos,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    createTodoMutation,
    updateTodoMutation,
    deleteTodoMutation,
    isError,
    error,
  } = useTodoQuery();

  return (
    <TodoContext.Provider
      value={{
        todos,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,

        createTodoMutation,
        updateTodoMutation,
        deleteTodoMutation,
        isError,
        error,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export const useTodoContext = () => useContext(TodoContext);
