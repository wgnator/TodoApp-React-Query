import { differenceInCalendarMonths } from "date-fns";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import useTodoQuery from "../hooks/fetch/useTodoQuery";

const TodoContext = createContext(
  {} as ReturnType<typeof useTodoQuery> & { todosMetaData: { length: number; beginningDate: Date } }
);

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

  const [todosMetaData, setTodosMetaData] = useState({ length: 0, beginningDate: new Date() });

  useEffect(() => {
    if (todos)
      setTodosMetaData({
        length: todos.length,
        beginningDate: new Date(todos[0].createdAt),
      });
  }, [todos]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        todosMetaData,
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
