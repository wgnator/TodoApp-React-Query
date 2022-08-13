import { useEffect, useState } from "react";
import { ReceivedTodoData } from "../types/types";

export type OrderTodosByType = (criterion: "updatedAt" | "createdAt", order: "newestFirst" | "oldestFirst") => void;
export type FilterTodosByCheckedType = (isValue: null | boolean) => void;
export type FilterTodosByStringType = (criterion: "title" | "content" | null, searchString: string) => void;

export default function useSortedTodos(todos: ReceivedTodoData[]) {
  const [sortedTodos, setSortedTodos] = useState(todos);

  useEffect(() => {
    setSortedTodos(todos);
  }, [todos]);

  useEffect(() => {
    orderTodosBy("updatedAt", "newestFirst");
  }, []);

  const orderTodosBy: OrderTodosByType = (criterion, order) =>
    setSortedTodos(
      order === "newestFirst"
        ? [...todos].sort((a: ReceivedTodoData, b: ReceivedTodoData) => new Date(b[criterion]).getTime() - new Date(a[criterion]).getTime())
        : [...todos].sort((a: ReceivedTodoData, b: ReceivedTodoData) => new Date(a[criterion]).getTime() - new Date(b[criterion]).getTime())
    );

  const filterTodosByChecked: FilterTodosByCheckedType = (isValue) => setSortedTodos(isValue === null ? todos : todos.filter((todo: ReceivedTodoData) => todo.checked === isValue));

  const filterTodosByString: FilterTodosByStringType = (criterion, searchString) =>
    setSortedTodos(
      criterion === null
        ? todos.filter((todo: ReceivedTodoData) => todo.title.includes(searchString) || todo.content.includes(searchString))
        : todos.filter((todo: ReceivedTodoData) => todo[criterion].includes(searchString))
    );

  return { sortedTodos, orderTodosBy, filterTodosByChecked, filterTodosByString };
}
