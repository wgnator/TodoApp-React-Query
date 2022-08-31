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
  id?: string;
}
