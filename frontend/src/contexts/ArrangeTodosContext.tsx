import { createContext } from "react";
import { filterTodosByCheckedType, filterTodosByType, reorderTodosByType } from "../models/useTodoDB";

type ArrangeTodosType = {
  reorderTodosBy: reorderTodosByType;
  filterTodosByChecked: filterTodosByCheckedType;
  filterTodosBy: filterTodosByType;
};

export const ArrangeTodos = createContext<ArrangeTodosType>({} as ArrangeTodosType);
export const ArrangeTodosProvider = (props) => <ArrangeTodos.Provider value={{ reorderTodosBy, filterTodosByChecked, filterTodosBy }}>{props.children}</ArrangeTodos.Provider>;
