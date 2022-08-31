import useTodoRequests from "./useTodoRequests";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ReceivedTodoData } from "../../types/types";

export default function useTodoQuery() {
  const { getTodos, createTodo, updateTodo, deleteTodo } = useTodoRequests();
  const { isLoading, isError, error, data } = useQuery<ReceivedTodoData[], Error>(
    ["todos"],
    getTodos,
    {
      retry: 0,
    }
  );
  const todos = data;
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
    isLoading,
    isError,
    error,
    todos,
    createTodoMutation,
    updateTodoMutation,
    deleteTodoMutation,
  };
}

// const App: React.FC = () => {
//   const { reset } = useQueryErrorResetBoundary()
//   return (
//     <ErrorBoundary
//       onReset={reset}
//       fallbackRender={({ resetErrorBoundary }) => (
//         <div>
//           There was an error!
//           <Button onClick={() => resetErrorBoundary()}>Try again</Button>
//         </div>
//       )}
//     >
//       <Page />
//     </ErrorBoundary>
//   )
// }
