import { ReceivedTodoData } from "../types/types";

export const sortTodos = (todos: ReceivedTodoData[]) => ({
  by: (criterion: "updatedAt" | "createdAt", order: "newestFirst" | "oldestFirst") =>
    order === "newestFirst"
      ? todos.sort((a: ReceivedTodoData, b: ReceivedTodoData) => new Date(b[criterion]).getTime() - new Date(a[criterion]).getTime())
      : todos.sort((a: ReceivedTodoData, b: ReceivedTodoData) => new Date(a[criterion]).getTime() - new Date(b[criterion]).getTime()),
});

export const filterTodosDataByChecked = (todos: ReceivedTodoData[]) => ({ is: (checkedToSearch: boolean) => todos.filter((todo: ReceivedTodoData) => todo.checked === checkedToSearch) });

export const filterTodosDataByString = (todos: ReceivedTodoData[]) => ({
  by: (criterion: "title" | "content") => ({
    contains: (searchString: string) => todos.filter((todo: ReceivedTodoData) => todo[criterion].includes(searchString)),
  }),
});
