import useTodoRequests from "./useTodoRequests";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ReceivedTodoData } from "../../types/types";

export default function useTodoQuery() {
  const { getTodos, createTodo, updateTodo, deleteTodo } = useTodoRequests();
  const data = useQuery<ReceivedTodoData[]>("todos", getTodos);
  const todos = data.data;
  const queryClient = useQueryClient();

  const handleMutationSuccess = () => {
    queryClient.invalidateQueries("todos");
  };
  const createTodoMutation = useMutation(createTodo, {
    onSuccess: handleMutationSuccess,
  });
  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: handleMutationSuccess,
  });
  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: handleMutationSuccess,
  });

  return { todos, createTodoMutation, updateTodoMutation, deleteTodoMutation };
}
