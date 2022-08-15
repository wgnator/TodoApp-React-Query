export interface ReceivedTodoData {
  title: string;
  content: string;
  checked: boolean;
  id: string;
  createdAt: string;
  updatedAt: string;
}
export interface SentTodoData {
  title?: string;
  content?: string;
  checked?: boolean;
  id: string;
}

export type OrderByType = { criterion: "updatedAt" | "createdAt"; order: "newestFirst" | "oldestFirst" };
export type SelectedOptionsType = {
  orderBy: OrderByType;
  filterByStringIncluding: string;
  filterByIsChecked: boolean | null;
};
