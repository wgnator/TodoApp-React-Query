import useTodoRequests from "./useTodoRequests";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { ReceivedTodoData } from "../../types/types";

export default function useTodoQuery() {
  const { getTodos, createTodo, updateTodo, deleteTodo } = useTodoRequests();
  const { fetchNextPage, isLoading, isFetchingNextPage, hasNextPage, isError, error, data } =
    useInfiniteQuery<{ result: ReceivedTodoData[]; page: number }, Error>(
      ["todos"],
      ({ pageParam = 0 }) => getTodos(pageParam),
      {
        retry: 0,
        keepPreviousData: true,
        getNextPageParam: (lastPage, allPages) => {
          console.log("last page:", lastPage, allPages);
          return lastPage.result.length > 1 && Number(lastPage.page) + 1;
        },
      }
    );
  const todos: ReceivedTodoData[] | undefined = data?.pages.reduce(
    (prev, page) => [...prev, ...page.result],
    [] as ReceivedTodoData[]
  );
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

  return {
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    todos,
    createTodoMutation,
    updateTodoMutation,
    deleteTodoMutation,
  };
}
