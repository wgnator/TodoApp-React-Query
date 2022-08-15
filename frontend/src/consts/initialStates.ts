import { SelectedOptionsType } from "../types/types";

export const initialSelectedOptionsState: SelectedOptionsType = {
  orderBy: { criterion: "updatedAt", order: "newestFirst" },
  filterByStringIncluding: "",
  filterByIsChecked: null,
};
