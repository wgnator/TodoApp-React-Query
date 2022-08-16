import useTodoRequests from "../models/useTodoRequests";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ReceivedTodoData } from "../types/types";
import { useEffect } from "react";

export default function useTodoQuery() {
  const { getTodos, createTodo, updateTodo, deleteTodo } = useTodoRequests();
  const data = useQuery<ReceivedTodoData[]>("todos", getTodos);
  const todos = data.data;
  const queryClient = useQueryClient();

  const createTodoMutation = useMutation(createTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });
  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });
  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  return { todos, createTodoMutation, updateTodoMutation, deleteTodoMutation };
}
