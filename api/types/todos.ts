export interface Todo {
  checked: boolean;
  content: string;
  createdAt: string;
  id: string;
  userId: string;
  title: string;
  updatedAt: string;
}

export type TodoInput = Pick<Todo, "title" | "content" | "userId" | "checked">;
