import { createContext, ReactNode, useContext, useEffect } from "react";
import useTodoQuery from "../hooks/fetch/useTodoQuery";

const TodoContext = createContext({} as ReturnType<typeof useTodoQuery>);

export function TodoContextProvider({ children }: { children: ReactNode }) {
  const { todos, createTodoMutation, updateTodoMutation, deleteTodoMutation } = useTodoQuery();
  useEffect(() => {
    console.log(todos);
  }, [todos]);

  return (
    <TodoContext.Provider
      value={{ todos, createTodoMutation, updateTodoMutation, deleteTodoMutation }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export const useTodoContext = () => useContext(TodoContext);
