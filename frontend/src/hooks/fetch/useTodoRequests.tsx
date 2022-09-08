import { useAuthContext } from "../../contexts/AuthContext";
import { useTodosDBWithCredentials } from "../../services/todosDBService";
import { ReceivedTodoData, SentTodoData } from "../../types/types";

export default function useTodoRequests() {
  const { logout, userToken } = useAuthContext();
  if (!userToken) {
    console.error("저장된 로그인 정보가 없습니다.");
    logout();
  }

  const todosDBService = useTodosDBWithCredentials();

  const getTodos = async (page: number) =>
    await todosDBService
      .get<{ data: { result: ReceivedTodoData[]; page: number } }>(`/?page=${page}`, {
        headers: { Authorization: userToken },
      })
      .then((response) => {
        return response.data.data;
      });

  const getTodosCount = async () =>
    await todosDBService
      .get("/?countOnly=true", { headers: { Authorization: userToken } })
      .then((response) => {
        console.log("data count:", response.data);
        return response.data.data;
      });
  // const getTodoById = async (id: string) => await todosDBService.get<ReceivedTodoData>(`/${id}`, { headers: { Authorization: userToken } });

  const createTodo = async (todo: SentTodoData) =>
    await todosDBService.post<SentTodoData>("/", todo, { headers: { Authorization: userToken } });

  const updateTodo = async (todo: SentTodoData) =>
    await todosDBService.put<SentTodoData>(`/${todo.id}`, todo, {
      headers: { Authorization: userToken },
    });

  const deleteTodo = async (todo: SentTodoData) =>
    await todosDBService.delete<SentTodoData>(`/${todo.id}`, {
      headers: { Authorization: userToken },
    });

  return { getTodos, getTodosCount, createTodo, updateTodo, deleteTodo };
}
