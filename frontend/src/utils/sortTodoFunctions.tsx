import { ReceivedTodoData, SelectedOptionsType } from "../types/types";

export type OrderTodosByType = (todos: ReceivedTodoData[], criterion: "updatedAt" | "createdAt", order: "newestFirst" | "oldestFirst") => ReceivedTodoData[];
export type FilterTodosByCheckedType = (todos: ReceivedTodoData[], isValue: null | boolean) => ReceivedTodoData[];
export type FilterTodosByStringType = (todos: ReceivedTodoData[], criterion: "title" | "content" | null, searchString: string) => ReceivedTodoData[];

export default function sortTodoFuntions() {
  const orderTodosBy: OrderTodosByType = (todos, criterion, order) =>
    todos &&
    (order === "newestFirst"
      ? [...todos].sort((a: ReceivedTodoData, b: ReceivedTodoData) => new Date(b[criterion]).getTime() - new Date(a[criterion]).getTime())
      : [...todos].sort((a: ReceivedTodoData, b: ReceivedTodoData) => new Date(a[criterion]).getTime() - new Date(b[criterion]).getTime()));

  const filterTodosByChecked: FilterTodosByCheckedType = (todos, isValue) => (isValue === null ? todos : todos?.filter((todo: ReceivedTodoData) => todo.checked === isValue));

  const filterTodosByString: FilterTodosByStringType = (todos, criterion, searchString) =>
    todos &&
    (criterion === null
      ? todos.filter((todo: ReceivedTodoData) => todo.title.includes(searchString) || todo.content.includes(searchString))
      : todos.filter((todo: ReceivedTodoData) => todo[criterion].includes(searchString)));

  const sortTodos = (todos: ReceivedTodoData[], options: SelectedOptionsType) =>
    filterTodosByString(filterTodosByChecked(orderTodosBy(todos, options.orderBy.criterion, options.orderBy.order), options.filterByIsChecked), null, options.filterByStringIncluding);

  return { sortTodos, orderTodosBy, filterTodosByChecked, filterTodosByString };
}
