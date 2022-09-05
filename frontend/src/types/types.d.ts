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

export interface CustomObject extends ObjectConstructor {
  entries<T, K>(o: { [k: K]: T } | ArrayLike<T>): [K, T][];
}
