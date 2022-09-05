import { useState } from "react";
import { CustomObject, ReceivedTodoData } from "../types/types";
import { isToday, isThisWeek, isThisMonth, isSameDay, isWithinInterval } from "date-fns";
import { SelectedDatesType } from "../components/DatePicker";

export const DATE_TYPE = {
  UPDATED_AT: "updatedAt",
  CREATED_AT: "createdAt",
} as const;

export type DateTypes = typeof DATE_TYPE[keyof typeof DATE_TYPE];
export type OrderTypes = typeof ORDER[keyof typeof ORDER];

export const ORDER = {
  DSC: "DSC",
  ASC: "ASC",
};

export const sortOptionsDictionary: {
  [K in typeof DATE_TYPE[keyof typeof DATE_TYPE] | typeof ORDER[keyof typeof ORDER]]: string;
} = {
  updatedAt: "수정",
  createdAt: "등록",
  DSC: "최근",
  ASC: "오래된",
};

export const TermDictionary = {
  today: { korean: "오늘", sequence: 0 },
  thisWeek: { korean: "이번주", sequence: 1 },
  thisMonth: { korean: "이번달", sequence: 2 },
  past: { korean: "이전", sequence: 3 },
} as const;

type TermDictionaryKey = keyof typeof TermDictionary;

export const FILTER_BY_CHECKED_OPTIONS = {
  CHECKED: true,
  UNCHECKED: false,
  UNFILTERED: null,
} as const;

export type FilterByCheckedOptions =
  typeof FILTER_BY_CHECKED_OPTIONS[keyof typeof FILTER_BY_CHECKED_OPTIONS];

export type SelectedOptionsType = {
  dateType: DateTypes;
  orderBy: OrderTypes;
  searchString: string;
  checkedState: typeof FILTER_BY_CHECKED_OPTIONS[keyof typeof FILTER_BY_CHECKED_OPTIONS];
  dateRange: SelectedDatesType;
};

const initialSelectedOptionsState: SelectedOptionsType = {
  dateType: DATE_TYPE.CREATED_AT,
  orderBy: ORDER.DSC,
  searchString: "",
  checkedState: FILTER_BY_CHECKED_OPTIONS.UNFILTERED,
  dateRange: { startDate: null, endDate: null },
};

type ReducedTodosType = {
  [K in TermDictionaryKey]: ReceivedTodoData[];
};

export default function useSortTodo() {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>(
    initialSelectedOptionsState
  );

  const sortTodosByOrder = {
    [ORDER.DSC]: (a: ReceivedTodoData, b: ReceivedTodoData) =>
      new Date(b[selectedOptions.dateType]).getTime() -
      new Date(a[selectedOptions.dateType]).getTime(),
    [ORDER.ASC]: (a: ReceivedTodoData, b: ReceivedTodoData) =>
      new Date(a[selectedOptions.dateType]).getTime() -
      new Date(b[selectedOptions.dateType]).getTime(),
  };

  const filterTodosByChecked = (todo: ReceivedTodoData) =>
    selectedOptions.checkedState === FILTER_BY_CHECKED_OPTIONS.UNFILTERED
      ? true
      : todo.checked === selectedOptions.checkedState;

  const filterTodosByString = (todo: ReceivedTodoData) =>
    todo.title.includes(selectedOptions.searchString) ||
    todo.content.includes(selectedOptions.searchString);

  const filterTodosBySingleDate = (todo: ReceivedTodoData) =>
    !!selectedOptions.dateRange.startDate &&
    isSameDay(new Date(todo[selectedOptions.dateType]), selectedOptions.dateRange.startDate);

  const filterTodosByDateRange = (todo: ReceivedTodoData) =>
    !!selectedOptions.dateRange.startDate &&
    !!selectedOptions.dateRange.endDate &&
    isWithinInterval(new Date(todo[selectedOptions.dateType]), {
      start: selectedOptions.dateRange.startDate,
      end: selectedOptions.dateRange.endDate,
    });

  const sortTodos = (todos: ReceivedTodoData[]) =>
    todos
      .filter(filterTodosByChecked)
      .filter(filterTodosByString)
      .filter(
        selectedOptions.dateRange.startDate
          ? selectedOptions.dateRange.endDate
            ? filterTodosByDateRange
            : filterTodosBySingleDate
          : () => true
      )
      .sort(sortTodosByOrder[selectedOptions.orderBy]);

  const CustomObject = Object as CustomObject;

  const reduceTodos = (todos: ReceivedTodoData[]) =>
    CustomObject.entries<ReceivedTodoData[], TermDictionaryKey>(
      todos.reduce(
        (prev: ReducedTodosType, curr: ReceivedTodoData): ReducedTodosType => {
          if (isToday(new Date(curr[selectedOptions.dateType]))) {
            prev.today.push(curr);
            return prev;
          }
          if (isThisWeek(new Date(curr[selectedOptions.dateType]), { weekStartsOn: 1 })) {
            prev.thisWeek.push(curr);
            return prev;
          }
          if (isThisMonth(new Date(curr[selectedOptions.dateType]))) {
            prev.thisMonth.push(curr);
            return prev;
          }
          {
            prev.past.push(curr);
            return prev;
          }
        },
        {
          today: [],
          thisWeek: [],
          thisMonth: [],
          past: [],
        } as ReducedTodosType
      )
    ).sort(
      (a: [TermDictionaryKey, ReceivedTodoData[]], b: [TermDictionaryKey, ReceivedTodoData[]]) =>
        selectedOptions.orderBy === ORDER.DSC
          ? TermDictionary[a[0]].sequence - TermDictionary[b[0]].sequence
          : TermDictionary[b[0]].sequence - TermDictionary[a[0]].sequence
    );

  return {
    selectedOptions,
    setSelectedOptions,
    sortTodos,
    reduceTodos,
  };
}
