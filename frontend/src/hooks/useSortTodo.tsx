import { useState } from "react";
import { ReceivedTodoData } from "../types/types";
import { isToday, isThisWeek, isThisMonth, isSameDay, isWithinInterval } from "date-fns";
import { TermDictionary } from "../consts/consts";
import { SelectedDatesType } from "../components/DatePicker";
import { todosDBService } from "../services/todosDBService";

export const SORT_OPTIONS = {
  UPDATED_AT: "updatedAt",
  CREATED_AT: "createdAt",
  NEWEST_FIRST: "newestFirst",
  OLDEST_FIRST: "oldestFirst",
} as const;

export const sortOptionsDictionary = {
  updatedAt: "수정",
  createdAt: "등록",
  newestFirst: "최근",
  oldestFirst: "오래된",
} as const;

export type OrderByType = {
  criterion: typeof SORT_OPTIONS["UPDATED_AT"] | typeof SORT_OPTIONS["CREATED_AT"];
  order: typeof SORT_OPTIONS["NEWEST_FIRST"] | typeof SORT_OPTIONS["OLDEST_FIRST"];
};
export type SelectedOptionsType = {
  orderBy: OrderByType;
  filterByStringIncluding: string;
  filterByIsChecked: boolean | null;
  filterByDate: SelectedDatesType;
};

export type OrderTodosByType = (
  todos: ReceivedTodoData[],
  criterion: OrderByType["criterion"],
  order: OrderByType["order"]
) => ReceivedTodoData[];

export type FilterTodosByCheckedType = (
  todos: ReceivedTodoData[],
  isValue: null | boolean
) => ReceivedTodoData[];

export type FilterTodosByStringType = (
  todos: ReceivedTodoData[],
  searchString: string
) => ReceivedTodoData[];

export const initialSelectedOptionsState: SelectedOptionsType = {
  orderBy: { criterion: SORT_OPTIONS.CREATED_AT, order: SORT_OPTIONS.NEWEST_FIRST },
  filterByStringIncluding: "",
  filterByIsChecked: null,
  filterByDate: { startDate: null, endDate: null },
};

export default function useSortTodo() {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>(
    initialSelectedOptionsState
  );
  const orderTodosBy: OrderTodosByType = (todos, criterion, order) =>
    todos &&
    (order === SORT_OPTIONS.NEWEST_FIRST
      ? [...todos].sort(
          (a: ReceivedTodoData, b: ReceivedTodoData) =>
            new Date(b[criterion]).getTime() - new Date(a[criterion]).getTime()
        )
      : [...todos].sort(
          (a: ReceivedTodoData, b: ReceivedTodoData) =>
            new Date(a[criterion]).getTime() - new Date(b[criterion]).getTime()
        ));

  const filterTodosByChecked: FilterTodosByCheckedType = (todos, isValue) =>
    isValue === null ? todos : todos?.filter((todo: ReceivedTodoData) => todo.checked === isValue);

  const filterTodosByString: FilterTodosByStringType = (todos, searchString) =>
    todos &&
    todos.filter(
      (todo: ReceivedTodoData) =>
        todo.title.includes(searchString) || todo.content.includes(searchString)
    );

  const filterTodosByDate = (
    todos: ReceivedTodoData[],
    criterion: OrderByType["criterion"],
    options: SelectedDatesType
  ) =>
    options.startDate && options.endDate && todos
      ? todos.filter(
          (todo) =>
            options.startDate &&
            options.endDate &&
            isWithinInterval(new Date(todo[criterion]), {
              start: options.startDate,
              end: options.endDate,
            })
        )
      : options.startDate && todos
      ? todos.filter(
          (todo) => options.startDate && isSameDay(new Date(todo[criterion]), options.startDate)
        )
      : todos;

  const sortTodos = (todos: ReceivedTodoData[], options: SelectedOptionsType) =>
    filterTodosByDate(
      filterTodosByString(
        filterTodosByChecked(
          orderTodosBy(todos, options.orderBy.criterion, options.orderBy.order),
          options.filterByIsChecked
        ),
        options.filterByStringIncluding
      ),
      options.orderBy.criterion,
      options.filterByDate
    );

  const reduceTodos = (
    todos: ReceivedTodoData[]
  ): { [value in keyof typeof TermDictionary]: ReceivedTodoData[] } =>
    todos.reduce(
      (prev, curr: ReceivedTodoData, _, todos) => {
        if (isToday(new Date(curr[selectedOptions.orderBy.criterion]))) {
          prev.today.push(curr);
          return prev;
        }
        if (isThisWeek(new Date(curr[selectedOptions.orderBy.criterion]))) {
          prev.thisWeek.push(curr);
          return prev;
        }
        if (isThisMonth(new Date(curr[selectedOptions.orderBy.criterion]))) {
          prev.thisMonth.push(curr);
          return prev;
        }
        {
          prev.past.push(curr);
          return prev;
        }
      },
      {
        today: [] as ReceivedTodoData[],
        thisWeek: [] as ReceivedTodoData[],
        thisMonth: [] as ReceivedTodoData[],
        past: [] as ReceivedTodoData[],
      }
    );

  return {
    selectedOptions,
    setSelectedOptions,
    sortTodos,
    reduceTodos,
    orderTodosBy,
    filterTodosByChecked,
    filterTodosByString,
  };
}
