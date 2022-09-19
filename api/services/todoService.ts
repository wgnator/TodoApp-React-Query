import { create, Data, db, update } from "../models/db";
import type { Todo, TodoInput } from "../types/todos";

export const createTodo = async (userId: string, { title, content }: TodoInput) => {
  const todo = create<Todo>({ title, content, checked: false });
  db.data?.todos[userId].push(todo);
  await db.write();

  return todo;
};

export const findTodos = (userId: string) => {
  return db.data?.todos[userId];
};

export const findTodo = (userId: string, predicate: (todo: Todo) => boolean) => {
  return db.data?.todos[userId].find(predicate);
};

export const updateTodo = async (todo: Todo, todoValue: Partial<Todo>) => {
  Object.assign(todo, update<Todo>({ ...todo, ...todoValue }));
  await db.write();
  return todo;
};

export const deleteTodo = async (userId: string, todoToDelete: Todo) => {
  const filteredTodos = db.data?.todos[userId].filter((todo) => todo.id !== todoToDelete.id)!;

  (db.data as Data).todos[userId] = filteredTodos;

  await db.write();

  return todoToDelete;
};
